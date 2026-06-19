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
 * 标题和段落功能测试
 */
test.describe('标题和段落功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能创建 H1 标题', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('# 一级标题')
    await page.keyboard.press('Space')

    await page.waitForTimeout(300)

    const h1 = page.locator('.ProseMirror h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('一级标题')
  })

  test('应该能创建 H2 标题', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('## 二级标题')
    await page.keyboard.press('Space')

    await page.waitForTimeout(300)

    const h2 = page.locator('.ProseMirror h2')
    await expect(h2).toBeVisible()
    await expect(h2).toContainText('二级标题')
  })

  test('应该能创建 H3 标题', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('### 三级标题')
    await page.keyboard.press('Space')

    await page.waitForTimeout(300)

    const h3 = page.locator('.ProseMirror h3')
    await expect(h3).toBeVisible()
    await expect(h3).toContainText('三级标题')
  })

  test('应该能创建多个段落', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('第一段')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第二段')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第三段')

    await page.waitForTimeout(300)

    const paragraphs = page.locator('.ProseMirror p')
    const count = await paragraphs.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('标题后应该能创建段落', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('# 标题')
    await page.keyboard.press('Space')
    await page.keyboard.press('Enter')
    await page.keyboard.type('这是段落')

    await page.waitForTimeout(300)

    const h1 = page.locator('.ProseMirror h1')
    await expect(h1).toBeVisible()

    // 使用更精确的选择器
    const p = page.locator('.ProseMirror p').filter({ hasText: '这是段落' })
    await expect(p).toBeVisible()
    await expect(p).toContainText('这是段落')
  })

  test('应该支持水平分隔线', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('---')
    await page.keyboard.press('Enter')

    await page.waitForTimeout(300)

    // 水平线通常是 hr 元素
    const hr = page.locator('.ProseMirror hr')
    await expect(hr).toBeVisible()
  })
})
