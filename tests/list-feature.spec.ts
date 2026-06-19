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
 * 列表功能测试
 */
test.describe('列表功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能创建无序列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 使用 markdown 快捷键
    await page.keyboard.type('- 第一项')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第二项')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第三项')

    await page.waitForTimeout(300)

    // 验证无序列表
    const ul = page.locator('.ProseMirror ul')
    await expect(ul).toBeVisible()

    const items = page.locator('.ProseMirror ul li')
    await expect(items).toHaveCount(3)
  })

  test('应该能创建有序列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // 使用 markdown 快捷键
    await page.keyboard.type('1. 第一步')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第二步')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第三步')

    await page.waitForTimeout(300)

    // 验证有序列表
    const ol = page.locator('.ProseMirror ol')
    await expect(ol).toBeVisible()

    const items = page.locator('.ProseMirror ol li')
    await expect(items).toHaveCount(3)
  })

  test('应该能创建嵌套列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('- 第一级')
    await page.keyboard.press('Enter')

    // 使用 Tab 创建嵌套
    await page.keyboard.press('Tab')
    await page.keyboard.type('第二级')
    await page.keyboard.press('Enter')
    await page.keyboard.type('第二级-2')

    await page.waitForTimeout(300)

    // 验证嵌套列表存在
    const nestedUl = page.locator('.ProseMirror ul ul')
    await expect(nestedUl).toBeVisible()
  })

  test('应该能取消嵌套', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('- 第一级')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await page.keyboard.type('第二级')

    // 使用 Shift+Tab 取消嵌套
    await page.keyboard.press('Shift+Tab')
    await page.keyboard.press('Enter')
    await page.keyboard.type('回到第一级')

    await page.waitForTimeout(300)

    // 验证有多个第一级项目
    const topLevelItems = page.locator('.ProseMirror > ul > li')
    const count = await topLevelItems.count()
    expect(count).toBeGreaterThanOrEqual(2)
  })

  test('应该能退出列表', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('- 列表项')
    await page.keyboard.press('Enter')

    // 空列表项时按两次 Enter 退出列表
    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)

    await page.keyboard.type('普通段落')
    await page.waitForTimeout(300)

    // 验证列表存在
    const ul = page.locator('.ProseMirror ul')
    await expect(ul).toBeVisible()

    // 验证普通文本存在
    const content = await editor.textContent()
    expect(content).toContain('普通段落')
  })

  test('列表项应该能应用文本格式', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    await page.keyboard.type('- 粗体列表项')

    // 全选
    await page.keyboard.press('Meta+a')

    // 应用粗体
    await page.keyboard.press('Meta+b')
    await page.waitForTimeout(200)

    // 验证粗体
    const strong = page.locator('.ProseMirror ul li strong')
    await expect(strong).toBeVisible()
  })
})
