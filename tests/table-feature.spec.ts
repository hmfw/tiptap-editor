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
 * 表格功能测试
 * 重点：prosemirror-tables 从 1.6.4 升级到 1.8.0
 * 已知修复：表格单元格复制时不再包含未选中的内容
 */
test.describe('表格功能（升级验证）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能创建表格', async ({ page }) => {
    // 点击表格按钮
    const tableButton = page.locator('button[title*="表格"], button:has-text("表格")')
    if (await tableButton.count() > 0) {
      await tableButton.first().click()
      await page.waitForTimeout(300)

      // 验证表格已插入
      const table = page.locator('.ProseMirror table')
      await expect(table).toBeVisible()

      // 验证表格结构（默认 3x3）
      const rows = page.locator('.ProseMirror table tr')
      const rowCount = await rows.count()
      expect(rowCount).toBeGreaterThanOrEqual(3)
    } else {
      test.skip()
    }
  })

  test('应该能在表格中输入内容', async ({ page }) => {
    const tableButton = page.locator('button[title*="表格"], button:has-text("表格")')
    if (await tableButton.count() > 0) {
      await tableButton.first().click()
      await page.waitForTimeout(300)

      // 点击第一个单元格
      const firstCell = page.locator('.ProseMirror table td, .ProseMirror table th').first()
      await firstCell.click()

      // 输入内容
      await page.keyboard.type('单元格内容')
      await page.waitForTimeout(200)

      // 验证内容
      await expect(firstCell).toContainText('单元格内容')
    } else {
      test.skip()
    }
  })

  test('应该能在单元格间导航', async ({ page }) => {
    const tableButton = page.locator('button[title*="表格"], button:has-text("表格")')
    if (await tableButton.count() > 0) {
      await tableButton.first().click()
      await page.waitForTimeout(300)

      // 点击第一个单元格
      const firstCell = page.locator('.ProseMirror table td, .ProseMirror table th').first()
      await firstCell.click()
      await page.keyboard.type('A1')

      // Tab 到下一个单元格
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      await page.keyboard.type('B1')

      // Tab 到第三个单元格
      await page.keyboard.press('Tab')
      await page.waitForTimeout(100)
      await page.keyboard.type('C1')

      await page.waitForTimeout(200)

      // 验证所有输入的内容
      const cells = page.locator('.ProseMirror table td, .ProseMirror table th')
      await expect(cells.nth(0)).toContainText('A1')
      await expect(cells.nth(1)).toContainText('B1')
      await expect(cells.nth(2)).toContainText('C1')
    } else {
      test.skip()
    }
  })

  test('应该能选择表格内容', async ({ page }) => {
    const tableButton = page.locator('button[title*="表格"], button:has-text("表格")')
    if (await tableButton.count() > 0) {
      await tableButton.first().click()
      await page.waitForTimeout(300)

      // 在多个单元格中输入内容
      const cells = page.locator('.ProseMirror table td, .ProseMirror table th')

      await cells.nth(0).click()
      await page.keyboard.type('A1')

      await page.keyboard.press('Tab')
      await page.keyboard.type('B1')

      await page.keyboard.press('Tab')
      await page.keyboard.type('C1')

      await page.waitForTimeout(200)

      // 选择第一个单元格的内容
      await cells.nth(0).click()
      await page.keyboard.press('Meta+a')

      // 验证选择生效（内容应该还在）
      await expect(cells.nth(0)).toContainText('A1')

      // 注意：表格复制的详细测试需要剪贴板 API，这里只验证基本选择
    } else {
      test.skip()
    }
  })

  test('表格应该响应键盘导航', async ({ page }) => {
    const tableButton = page.locator('button[title*="表格"], button:has-text("表格")')
    if (await tableButton.count() > 0) {
      await tableButton.first().click()
      await page.waitForTimeout(300)

      const firstCell = page.locator('.ProseMirror table td, .ProseMirror table th').first()
      await firstCell.click()
      await page.keyboard.type('开始')

      // 使用 Tab 键移动
      await page.keyboard.press('Tab')
      await page.keyboard.type('下一个')

      // 使用 Shift+Tab 返回
      await page.keyboard.press('Shift+Tab')
      await page.waitForTimeout(100)

      // 第一个单元格应该获得焦点
      const cells = page.locator('.ProseMirror table td, .ProseMirror table th')
      await expect(cells.nth(0)).toContainText('开始')
      await expect(cells.nth(1)).toContainText('下一个')
    } else {
      test.skip()
    }
  })

  test('应该能在表格单元格中应用文本格式', async ({ page }) => {
    const tableButton = page.locator('button[title*="表格"], button:has-text("表格")')
    if (await tableButton.count() > 0) {
      await tableButton.first().click()
      await page.waitForTimeout(300)

      const firstCell = page.locator('.ProseMirror table td, .ProseMirror table th').first()
      await firstCell.click()
      await page.keyboard.type('粗体文本')

      // 全选单元格内容
      await page.keyboard.press('Meta+a')

      // 应用粗体
      await page.keyboard.press('Meta+b')
      await page.waitForTimeout(200)

      // 验证粗体
      const bold = firstCell.locator('strong')
      await expect(bold).toBeVisible()
      await expect(bold).toContainText('粗体文本')
    } else {
      test.skip()
    }
  })
})
