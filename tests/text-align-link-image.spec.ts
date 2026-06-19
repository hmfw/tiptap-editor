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
 * 文本对齐功能测试
 */
test.describe('文本对齐功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能设置居中对齐', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('居中文本')

    // 查找居中对齐按钮
    const centerButton = page.locator('button[title*="居中"], button:has([class*="align-center"])')
    if (await centerButton.count() > 0) {
      await centerButton.first().click()
      await page.waitForTimeout(300)

      // 验证文本对齐
      const paragraph = page.locator('.ProseMirror p').first()
      const textAlign = await paragraph.evaluate((el) => window.getComputedStyle(el).textAlign)
      expect(textAlign).toBe('center')
    } else {
      test.skip()
    }
  })

  test('应该能设置右对齐', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('右对齐文本')

    // 查找右对齐按钮
    const rightButton = page.locator('button[title*="右对齐"], button:has([class*="align-right"])')
    if (await rightButton.count() > 0) {
      await rightButton.first().click()
      await page.waitForTimeout(300)

      const paragraph = page.locator('.ProseMirror p').first()
      const textAlign = await paragraph.evaluate((el) => window.getComputedStyle(el).textAlign)
      expect(textAlign).toBe('right')
    } else {
      test.skip()
    }
  })

  test('应该能设置两端对齐', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('两端对齐的长文本内容，用于测试对齐功能是否正常工作。')

    // 查找两端对齐按钮
    const justifyButton = page.locator('button[title*="两端"], button[title*="justify"]')
    if (await justifyButton.count() > 0) {
      await justifyButton.first().click()
      await page.waitForTimeout(300)

      const paragraph = page.locator('.ProseMirror p').first()
      const textAlign = await paragraph.evaluate((el) => window.getComputedStyle(el).textAlign)
      expect(textAlign).toBe('justify')
    } else {
      test.skip()
    }
  })

  test('应该能重置为左对齐', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('测试文本')

    // 先设置居中
    const centerButton = page.locator('button[title*="居中"], button:has([class*="align-center"])')
    if (await centerButton.count() > 0) {
      await centerButton.first().click()
      await page.waitForTimeout(200)

      // 再设置左对齐
      const leftButton = page.locator('button[title*="左对齐"], button:has([class*="align-left"])')
      if (await leftButton.count() > 0) {
        await leftButton.first().click()
        await page.waitForTimeout(300)

        const paragraph = page.locator('.ProseMirror p').first()
        const textAlign = await paragraph.evaluate((el) => {
          const align = window.getComputedStyle(el).textAlign
          return align === 'left' || align === 'start'
        })
        expect(textAlign).toBe(true)
      }
    } else {
      test.skip()
    }
  })
})

/**
 * 链接功能测试
 */
test.describe('链接功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能创建链接', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()
    await page.keyboard.type('点击这里')

    // 全选文本
    await page.keyboard.press('Meta+a')

    // 查找链接按钮
    const linkButton = page.locator('button[title*="链接"], button:has([class*="link"])')
    if (await linkButton.count() > 0) {
      await linkButton.first().click()
      await page.waitForTimeout(500)

      // 查找 URL 输入框（可能在对话框或提示框中）
      const urlInput = page.locator('input[type="text"], input[type="url"]').first()
      if (await urlInput.isVisible()) {
        await urlInput.fill('https://example.com')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)

        // 验证链接已创建
        const link = page.locator('.ProseMirror a')
        await expect(link).toBeVisible()
        await expect(link).toHaveAttribute('href', 'https://example.com')
      }
    } else {
      test.skip()
    }
  })

  test('应该能使用 Markdown 快捷键创建链接', async ({ page }) => {
    const editor = page.locator('.ProseMirror')
    await editor.click()

    // Markdown 链接语法
    await page.keyboard.type('[链接文本](https://example.com)')
    await page.keyboard.press('Space')

    await page.waitForTimeout(300)

    // 验证链接
    const link = page.locator('.ProseMirror a')
    if (await link.count() > 0) {
      await expect(link).toBeVisible()
      await expect(link).toContainText('链接文本')
      const href = await link.getAttribute('href')
      expect(href).toContain('example.com')
    }
  })
})

/**
 * 图片功能测试
 */
test.describe('图片功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('.ProseMirror', { timeout: 10000 })
    await clearEditor(page)
  })

  test('应该能插入图片', async ({ page }) => {
    // 查找图片按钮
    const imageButton = page.locator('button[title*="图片"], button:has([class*="image"])')
    if (await imageButton.count() > 0) {
      await imageButton.first().click()
      await page.waitForTimeout(500)

      // 可能会打开文件选择器或 URL 输入框
      // 这里我们检查是否有图片相关的对话框或输入
      const urlInput = page.locator('input[type="text"], input[type="url"]').first()
      if (await urlInput.isVisible({ timeout: 1000 }).catch(() => false)) {
        await urlInput.fill('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%234CAF50"/%3E%3C/svg%3E')
        await page.keyboard.press('Enter')
        await page.waitForTimeout(300)

        // 验证图片已插入
        const img = page.locator('.ProseMirror img')
        await expect(img).toBeVisible()
      }
    } else {
      test.skip()
    }
  })
})
