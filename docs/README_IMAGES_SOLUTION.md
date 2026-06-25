# README 图片显示解决方案

## 问题描述

当前 README.md 使用相对路径引用图片：
```markdown
![编辑器全貌](docs/screenshots/screenshot-overview.png)
```

**存在的问题**:
1. npm 包的 `files` 字段只包含 `dist`，不包含 `docs/screenshots/`
2. npm 官网无法显示相对路径的图片
3. 国内用户访问 npm 可能有网络问题

## 推荐方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **GitHub Raw URL** | 简单、免费、稳定 | 需要仓库公开 | ⭐⭐⭐⭐⭐ |
| **jsDelivr CDN** | 全球 CDN、速度快、国内友好 | 依赖第三方服务 | ⭐⭐⭐⭐⭐ |
| **unpkg CDN** | npm 官方支持、自动同步 | 国内可能较慢 | ⭐⭐⭐⭐ |
| **包含在 npm 包中** | 完全自包含 | 增加包体积（173 KB） | ⭐⭐⭐ |
| **图床服务** | 快速、专业 | 需要额外服务、可能失效 | ⭐⭐ |

## 方案 1: GitHub Raw URL（推荐）

### 优点
- ✅ 免费
- ✅ 仓库已经有图片
- ✅ 稳定可靠
- ✅ 不增加 npm 包体积
- ✅ 国内访问尚可

### 实施步骤

```markdown
## 效果预览

![编辑器全貌](https://raw.githubusercontent.com/hmfw/tiptap-editor/main/docs/screenshots/screenshot-overview.png)

![代码块与表格](https://raw.githubusercontent.com/hmfw/tiptap-editor/main/docs/screenshots/screenshot-features.png)

![数学公式](https://raw.githubusercontent.com/hmfw/tiptap-editor/main/docs/screenshots/screenshot-math.png)
```

### 图片 URL 格式
```
https://raw.githubusercontent.com/{username}/{repo}/{branch}/path/to/image.png
```

## 方案 2: jsDelivr CDN（最推荐）

### 优点
- ✅ 全球 CDN 加速
- ✅ **国内速度快**（有国内节点）
- ✅ 自动从 GitHub 同步
- ✅ 免费且稳定
- ✅ 支持版本锁定

### 实施步骤

```markdown
## 效果预览

![编辑器全貌](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-overview.png)

![代码块与表格](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-features.png)

![数学公式](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-math.png)
```

### 图片 URL 格式
```
https://cdn.jsdelivr.net/gh/{username}/{repo}@{tag or branch}/path/to/image.png
```

### 版本锁定（推荐）
```markdown
# 锁定到特定标签
https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@v1.0.4/docs/screenshots/screenshot-overview.png

# 或使用 latest（自动指向最新 release）
https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@latest/docs/screenshots/screenshot-overview.png
```

## 方案 3: unpkg CDN

### 优点
- ✅ npm 官方认可
- ✅ 自动从 npm 包同步
- ✅ 简洁的 URL

### 缺点
- ⚠️ 需要将图片包含在 npm 包中
- ⚠️ 增加包体积

### 实施步骤

1. **修改 package.json**:
```json
{
  "files": [
    "dist",
    "docs/screenshots"
  ]
}
```

2. **更新 README.md**:
```markdown
![编辑器全貌](https://unpkg.com/@hmfw/tiptap-editor@latest/docs/screenshots/screenshot-overview.png)
```

### 图片 URL 格式
```
https://unpkg.com/{package-name}@{version}/path/to/image.png
```

## 方案 4: 包含在 npm 包中

### 优点
- ✅ 完全自包含
- ✅ 不依赖外部服务

### 缺点
- ❌ 增加包体积（173 KB）
- ❌ 用户下载包时包含不必要的文件

### 实施步骤

1. **修改 package.json**:
```json
{
  "files": [
    "dist",
    "docs/screenshots",
    "README.md"
  ]
}
```

2. **README.md 保持相对路径**:
```markdown
![编辑器全貌](docs/screenshots/screenshot-overview.png)
```

3. **注意**: npm 官网可能仍然无法显示

## 方案 5: 图床服务

### 可选服务
- [imgur.com](https://imgur.com/) - 国际知名
- [sm.ms](https://sm.ms/) - 国内可用
- [图壳](https://imgkr.com/) - 国内服务

### 优点
- ✅ 专业图床服务
- ✅ 速度快

### 缺点
- ❌ 需要手动上传
- ❌ 可能失效
- ❌ 额外依赖

## 混合方案（最佳实践）

结合多个方案，提供最佳体验：

```markdown
## 效果预览

> 如果图片无法显示，请访问 [在线文档](https://github.com/hmfw/tiptap-editor#效果预览) 或 [在线演示](https://hmfw.github.io/tiptap-editor)

### 编辑器全貌
![编辑器全貌](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-overview.png)

### 代码块与表格
![代码块与表格](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-features.png)

### 数学公式
![数学公式](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-math.png)

查看 [在线演示](https://hmfw.github.io/tiptap-editor) 获得最佳体验。
```

## 推荐实施方案

### 🏆 首选: jsDelivr CDN

**理由**:
1. 国内外速度都快
2. 免费且稳定
3. 不增加 npm 包体积
4. 自动从 GitHub 同步

**实施**:
1. 确保图片已提交到 GitHub
2. 更新 README.md 使用 jsDelivr URL
3. 可选：添加在线演示链接作为备用

### 具体 URL 替换

```markdown
# 当前
![编辑器全貌](docs/screenshots/screenshot-overview.png)

# 改为
![编辑器全貌](https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-overview.png)
```

## 验证方法

### 1. GitHub 上验证
```bash
# 提交 README 更新
git add README.md
git commit -m "docs: 使用 CDN 图片链接"
git push

# 在 GitHub 上查看 README 是否正常显示
```

### 2. npm 上验证
```bash
# 发布新版本
npm version patch
npm publish

# 访问 npm 官网查看
# https://www.npmjs.com/package/@hmfw/tiptap-editor
```

### 3. 本地测试 jsDelivr
```bash
# 在浏览器中直接访问图片 URL
https://cdn.jsdelivr.net/gh/hmfw/tiptap-editor@main/docs/screenshots/screenshot-overview.png
```

## 额外建议

### 1. 提供在线演示
最好的预览方式是提供在线可交互的演示：

```markdown
## 在线演示

🎮 [点击这里体验在线演示](https://hmfw.github.io/tiptap-editor)

## 效果预览

（图片略）
```

可以使用：
- GitHub Pages
- Vercel
- Netlify

### 2. 创建 GIF 动画
静态截图改为 GIF 动画，展示交互效果：
- 使用 [LICEcap](https://www.cockos.com/licecap/) 录制
- 使用 [ScreenToGif](https://www.screentogif.com/) 录制

### 3. 添加备用说明
```markdown
> 📸 如果图片加载失败，请访问：
> - [GitHub 仓库查看完整文档](https://github.com/hmfw/tiptap-editor)
> - [在线演示](https://hmfw.github.io/tiptap-editor)
```

## 总结

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| **国内外兼顾** | jsDelivr CDN | 全球 CDN，国内速度好 |
| **最简单** | GitHub Raw URL | 无需额外配置 |
| **完全自包含** | 包含在 npm 包 | 不依赖外部，但增加体积 |
| **最佳体验** | 在线演示 + CDN 图片 | 可交互 + 快速预览 |

**立即行动**: 使用 jsDelivr CDN 替换当前的相对路径。

---

**生成时间**: 2026-06-19  
**推荐方案**: jsDelivr CDN  
**备用方案**: GitHub Raw URL + 在线演示链接
