import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import postcss from 'postcss'
import ts from 'typescript'
import prettier from 'prettier'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// 将构建产物 CSS 重排为“每条规则一行”：
// 顶层规则各占一行，规则体内声明紧凑排列（selector{a: 1;b: 2;}）。
// @keyframes / @media 等含嵌套规则的块整体占一行。
function oneRulePerLineCss(): Plugin {
  const format = (css: string): string => {
    const root = postcss.parse(css)
    root.walk((node) => {
      const topLevel = node.parent?.type === 'root'
      if (node.type === 'rule') {
        node.raws.before = topLevel ? '\n' : ''
        node.raws.between = ''
        node.raws.after = ''
        node.raws.semicolon = true
      } else if (node.type === 'atrule') {
        node.raws.before = topLevel ? '\n' : ''
        node.raws.afterName = ' '
        node.raws.between = ''
        node.raws.after = ''
        node.raws.semicolon = true
      } else if (node.type === 'decl') {
        node.raws.before = ''
        node.raws.between = ': '
      } else if (node.type === 'comment') {
        node.raws.before = topLevel ? '\n' : ''
      }
    })
    return root.toString().replace(/^\n/, '') + '\n'
  }

  return {
    name: 'one-rule-per-line-css',
    // CSS 由 Vite 内部插件在 generateBundle 之后写出，因此在 writeBundle
    // 阶段读取磁盘上的产物再重排（幂等，多 format 构建重复执行结果一致）。
    writeBundle(options) {
      const dir = options.dir ?? 'dist'
      for (const name of readdirSync(dir)) {
        if (!name.endsWith('.css')) continue
        const filePath = join(dir, name)
        writeFileSync(filePath, format(readFileSync(filePath, 'utf8')))
      }
    },
  }
}

// 重排 rollupTypes 生成的 dist/index.d.ts：
// 1) 按模块合并重复的 import（api-extractor 会为每个符号单独生成一条 import，
//    造成多条 `import { X } from 'vue'`），合并为每个模块一条并按名称排序；
// 2) 交给 prettier 统一格式化（与项目 .prettierrc 一致），保留 JSDoc 注释
//    与末尾的 `declare module '@tiptap/core'` 声明合并。
function formatDtsPlugin(): Plugin {
  // 用 AST 合并同模块的重复 import，返回可交给 prettier 的 TS 源码文本。
  const mergeImports = (code: string): string => {
    const sf = ts.createSourceFile(
      'index.d.ts',
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    )
    const f = ts.factory
    // module -> (specifierKey -> {prop, name})，保留 `X as Y` 别名，去重
    const groups = new Map<string, Map<string, { prop?: string; name: string }>>()
    const order: string[] = []
    const rest: ts.Statement[] = []

    for (const s of sf.statements) {
      if (
        ts.isImportDeclaration(s) &&
        s.importClause?.namedBindings &&
        ts.isNamedImports(s.importClause.namedBindings) &&
        ts.isStringLiteral(s.moduleSpecifier)
      ) {
        const mod = s.moduleSpecifier.text
        if (!groups.has(mod)) {
          groups.set(mod, new Map())
          order.push(mod)
        }
        const g = groups.get(mod)!
        for (const el of s.importClause.namedBindings.elements) {
          const key = (el.propertyName?.text ?? el.name.text) + '|' + el.name.text
          if (!g.has(key)) g.set(key, { prop: el.propertyName?.text, name: el.name.text })
        }
      } else {
        rest.push(s)
      }
    }

    const imports = order.map((mod) => {
      const specs = [...groups.get(mod)!.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((e) =>
          f.createImportSpecifier(
            false,
            e.prop ? f.createIdentifier(e.prop) : undefined,
            f.createIdentifier(e.name),
          ),
        )
      return f.createImportDeclaration(
        undefined,
        f.createImportClause(false, undefined, f.createNamedImports(specs)),
        f.createStringLiteral(mod, true),
        undefined,
      )
    })

    const newSf = f.updateSourceFile(sf, [...imports, ...rest])
    const printer = ts.createPrinter({ removeComments: false, newLine: ts.NewLineKind.LineFeed })
    return printer.printFile(newSf)
  }

  return {
    name: 'format-dts',
    async writeBundle(options) {
      const dir = options.dir ?? 'dist'
      const filePath = join(dir, 'index.d.ts')
      if (!existsSync(filePath)) return
      const merged = mergeImports(readFileSync(filePath, 'utf8'))
      const cfg = await prettier.resolveConfig(resolve(filePath))
      const out = await prettier.format(merged, { ...cfg, parser: 'typescript' })
      writeFileSync(filePath, out)
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        vue(),
        vueJsx(),
        oneRulePerLineCss(),
        dts({
          include: ['src'],
          exclude: ['src/main.ts', 'src/App.tsx'],
          outDir: 'dist',
          rollupTypes: true,
          tsconfigPath: './tsconfig.app.json',
        }),
        formatDtsPlugin(),
      ],
      build: {
        copyPublicDir: false,
        cssMinify: false,
        lib: {
          entry: './src/index.ts',
          name: 'TiptapEditor',
          fileName: 'tiptap-editor',
          formats: ['es', 'umd'],
        },
        rollupOptions: {
          external: [
            'vue',
            /^@tiptap\//,
            'katex',
            // 外部化 katex 样式：保留为 import 语句交给消费方打包器处理，
            // 避免 KaTeX 字体被内联进本库 CSS
            'katex/dist/katex.min.css',
            'lowlight',
          ],
          output: {
            globals: {
              vue: 'Vue',
              '@tiptap/core': 'TiptapCore',
              '@tiptap/vue-3': 'TiptapVue3',
              '@tiptap/vue-3/menus': 'TiptapVue3Menus',
              '@tiptap/starter-kit': 'TiptapStarterKit',
              '@tiptap/extension-list': 'TiptapExtensionList',
              '@tiptap/extension-text-align': 'TiptapExtensionTextAlign',
              '@tiptap/extension-placeholder': 'TiptapExtensionPlaceholder',
              '@tiptap/extension-image': 'TiptapExtensionImage',
              '@tiptap/extension-code-block-lowlight': 'TiptapExtensionCodeBlockLowlight',
              '@tiptap/extension-table': 'TiptapExtensionTable',
              '@tiptap/extension-mathematics': 'TiptapExtensionMathematics',
              '@tiptap/pm/state': 'TiptapPmState',
              '@tiptap/pm/view': 'TiptapPmView',
              katex: 'katex',
              lowlight: 'lowlight',
            },
          },
        },
      },
    }
  }

  return {
    base: '/tiptap-editor/',
    plugins: [vue(), vueJsx()],
    build: {
      outDir: 'dist-app',
    },
  }
})
