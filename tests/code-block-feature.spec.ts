import { test, expect } from '@playwright/test'

/**
 * 辅助函数：清空编辑器内容
 */
async function clearEditor(page) {
  const editor = page.locator('.ProseMirror')
  await editor.click()
  await page.keyboard.press('Meta+a')
  await page.keyboard.press('Backspace')
  await page.waitForTimeout(200)
}

/**
 * 代码块功能测试
 * 已知修复：内联代码 markdown 快捷键前输入字符不会删除前置字符
 */
test.describe('代码块功能（升级验证）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能插入代码块', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 使用 markdown 快捷键创建代码块
    await page.keyboard.type('```javascript')
    await page.keyboard.press('Enter')
    await page.keyboard.type('console.log("Hello World");')

    // 验证代码块存在
    await page.waitForTimeout(300)
    const codeBlock = page.locator('.ProseMirror pre code')
    await expect(codeBlock).toBeVisible()
    await expect(codeBlock).toContainText('console.log')
  })

  test('代码块应该有语法高亮', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('```javascript')
    await page.keyboard.press('Enter')
    await page.keyboard.type('const x = 123;')

    // 等待语法高亮应用
    await page.waitForTimeout(500)

    // 验证代码块存在
    const codeBlock = page.locator('.ProseMirror pre code')
    await expect(codeBlock).toBeVisible()
    await expect(codeBlock).toContainText('const x = 123;')

    // 验证有 language class
    const hasLanguageClass = await codeBlock.evaluate((el) => {
      return el.className.includes('language-')
    })
    expect(hasLanguageClass).toBe(true)
  })

  test('修复验证：内联代码前输入字符不应删除前置内容', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 输入一个字符后面跟一个空格
    await page.keyboard.type('a ')
    await page.waitForTimeout(100)

    // 输入内联代码 markdown 快捷键
    await page.keyboard.type('`code`')
    await page.waitForTimeout(300)

    // 验证完整内容
    const content = await editor.textContent()
    expect(content).toContain('a')
    expect(content).toContain('code')

    // 验证内联代码被创建
    const code = editor.locator('code')
    await expect(code).toBeVisible()
    await expect(code).toContainText('code')
  })

  test('应该能在代码块中换行', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('```python')
    await page.keyboard.press('Enter')
    await page.keyboard.type('def hello():')
    await page.keyboard.press('Enter')
    await page.keyboard.type('    print("Hello")')

    await page.waitForTimeout(300)

    const codeBlock = page.locator('.ProseMirror pre code')
    await expect(codeBlock).toBeVisible()
    await expect(codeBlock).toContainText('def hello()')
    await expect(codeBlock).toContainText('print("Hello")')
  })

  test('应该支持多种编程语言', async ({ page }) => {
    const editor = page.locator('.ProseMirror')

    // 测试 TypeScript
    await editor.click()
    await page.keyboard.type('```typescript')
    await page.keyboard.press('Enter')
    await page.keyboard.type('type User = { name: string }')

    await page.waitForTimeout(300)
    let codeBlock = page.locator('.ProseMirror pre code').last()
    await expect(codeBlock).toContainText('type User')

    // 退出代码块
    await page.keyboard.press('Escape')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')

    // 测试 Python
    await page.keyboard.type('```python')
    await page.keyboard.press('Enter')
    await page.keyboard.type('print("Hello")')

    await page.waitForTimeout(300)
    codeBlock = page.locator('.ProseMirror pre code').last()
    await expect(codeBlock).toContainText('print')
  })

  test('应该能退出代码块', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('```javascript')
    await page.keyboard.press('Enter')
    await page.keyboard.type('const x = 1')

    // 退出代码块 - 使用 Escape 或者到代码块末尾按两次 Enter
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    // 现在应该在代码块外，输入普通文本
    await page.keyboard.type('普通段落')
    await page.waitForTimeout(300)

    // 验证代码块存在
    const codeBlock = page.locator('.ProseMirror pre code')
    await expect(codeBlock).toContainText('const x = 1')

    // 验证普通文本存在（应该在代码块之后）
    const content = await editor.textContent()
    expect(content).toContain('普通段落')
  })
})
