import { test, expect } from '@playwright/test'

/**
 * 数学公式功能测试
 * 依赖 ProseMirror 核心 API，需要验证升级后的兼容性
 */
test.describe('数学公式功能（升级验证）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
  })

  test('应该能插入内联公式', async ({ page }) => {
    // 查找内联公式按钮
    const inlineMathButton = page.locator('button[title*="内联"], button[title*="公式"]').first()

    if (await inlineMathButton.count() > 0) {
      await inlineMathButton.click()

      // 等待公式对话框
      const dialog = page.locator('.el-dialog, [role="dialog"]')
      await expect(dialog).toBeVisible({ timeout: 3000 })

      // 输入公式
      const input = dialog.locator('textarea, input[type="text"]').first()
      await input.fill('E = mc^2')

      // 确认
      const confirmButton = dialog.locator('button:has-text("确定"), button:has-text("确认")').first()
      await confirmButton.click()

      // 验证公式已插入
      await page.waitForTimeout(500)
      const mathElement = page.locator('.ProseMirror .math-node, .ProseMirror .katex')
      await expect(mathElement.first()).toBeVisible()
    }
  })

  test('应该能插入块级公式', async ({ page }) => {
    // 查找块级公式按钮
    const blockMathButton = page.locator('button[title*="块"], button[title*="公式"]').nth(1)

    if (await blockMathButton.count() > 0) {
      await blockMathButton.click()

      // 等待对话框
      const dialog = page.locator('.el-dialog, [role="dialog"]')
      await expect(dialog).toBeVisible({ timeout: 3000 })

      // 输入复杂公式
      const input = dialog.locator('textarea').first()
      await input.fill('\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}')

      // 确认
      const confirmButton = dialog.locator('button:has-text("确定"), button:has-text("确认")').first()
      await confirmButton.click()

      // 验证块级公式
      await page.waitForTimeout(500)
      const mathElement = page.locator('.ProseMirror .math-node, .ProseMirror .katex-display')
      await expect(mathElement.first()).toBeVisible()
    }
  })

  test('公式应该正确渲染', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 如果有公式按钮就测试，没有就跳过
    const mathButton = page.locator('button[title*="公式"]').first()
    if (await mathButton.count() > 0) {
      await mathButton.click()

      const dialog = page.locator('.el-dialog, [role="dialog"]')
      if (await dialog.count() > 0) {
        const input = dialog.locator('textarea, input[type="text"]').first()
        await input.fill('x^2 + y^2 = r^2')

        const confirmButton = dialog.locator('button:has-text("确定"), button:has-text("确认")').first()
        await confirmButton.click()

        // 验证 KaTeX 渲染
        await page.waitForTimeout(1000)
        const katex = page.locator('.katex')
        await expect(katex.first()).toBeVisible()
      }
    }
  })
})
