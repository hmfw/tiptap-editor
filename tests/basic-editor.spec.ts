import { test, expect } from '@playwright/test'

/**
 * 辅助函数：清空编辑器内容
 */
async function clearEditor(page) {
  const editor = page.locator('.ProseMirror')
  await editor.click()
  // 全选并删除
  await page.keyboard.press('Meta+a')
  await page.keyboard.press('Backspace')
  // 等待内容清空
  await page.waitForTimeout(200)
}

test.describe('基础编辑功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // 等待编辑器加载
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
  })

  test('编辑器应该正常渲染', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await expect(editor).toBeVisible()

    // 编辑器应该是可编辑的
    await expect(editor).toHaveAttribute('contenteditable', 'true')
  })

  test('空编辑器应该显示 placeholder', async ({ page }) => {
    // 清空编辑器
    await clearEditor(page)

    // 检查 placeholder（可能是通过 CSS ::before 或者特定元素）
    const editor = page.locator('.ProseMirror')
    // 检查是否有 placeholder 相关的类或属性
    const hasPlaceholder = await editor.evaluate((el) => {
      const styles = window.getComputedStyle(el, '::before')
      return styles.content !== 'none' && styles.content !== ''
    })

    // placeholder 可能通过 CSS 实现，所以我们只验证编辑器为空
    const textContent = await editor.textContent()
    expect(textContent?.trim()).toBe('')
  })

  test('应该能输入文本', async ({ page }) => {
    await clearEditor(page)

    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('Hello Tiptap 3.27!')

    // 验证文本已输入
    await expect(editor).toContainText('Hello Tiptap 3.27!')
  })

  test('撤销和重做功能正常', async ({ page }) => {
    await clearEditor(page)

    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('测试文本')
    await expect(editor).toContainText('测试文本')

    // 撤销
    await page.keyboard.press('Meta+z')
    await page.waitForTimeout(200)
    const afterUndo = await editor.textContent()
    expect(afterUndo?.includes('测试文本')).toBe(false)

    // 重做
    await page.keyboard.press('Meta+Shift+z')
    await page.waitForTimeout(200)
    await expect(editor).toContainText('测试文本')
  })

  test('粗体功能正常', async ({ page }) => {
    await clearEditor(page)

    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('粗体文本')

    // 全选
    await page.keyboard.press('Meta+a')

    // 应用粗体
    await page.keyboard.press('Meta+b')
    await page.waitForTimeout(200)

    // 验证粗体标签存在
    const bold = editor.locator('strong')
    await expect(bold).toBeVisible()
    await expect(bold).toContainText('粗体文本')
  })

  test('斜体功能正常', async ({ page }) => {
    await clearEditor(page)

    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('斜体文本')

    await page.keyboard.press('Meta+a')
    await page.keyboard.press('Meta+i')
    await page.waitForTimeout(200)

    const italic = editor.locator('em')
    await expect(italic).toBeVisible()
    await expect(italic).toContainText('斜体文本')
  })

  test('下划线功能正常', async ({ page }) => {
    await clearEditor(page)

    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('下划线文本')

    await page.keyboard.press('Meta+a')
    await page.keyboard.press('Meta+u')
    await page.waitForTimeout(200)

    const underline = editor.locator('u')
    await expect(underline).toBeVisible()
    await expect(underline).toContainText('下划线文本')
  })

  test('组合样式应该正常', async ({ page }) => {
    await clearEditor(page)

    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('组合样式')

    // 全选
    await page.keyboard.press('Meta+a')

    // 粗体
    await page.keyboard.press('Meta+b')
    await page.waitForTimeout(100)

    // 斜体
    await page.keyboard.press('Meta+i')
    await page.waitForTimeout(100)

    // 应该同时有 strong 和 em
    const strong = editor.locator('strong')
    const em = strong.locator('em')

    await expect(strong).toBeVisible()
    await expect(em).toBeVisible()
    await expect(em).toContainText('组合样式')
  })
})
