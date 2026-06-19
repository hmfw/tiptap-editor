import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 配置
 * 用于测试 Tiptap 编辑器升级后的功能
 */
export default defineConfig({
  testDir: './tests',

  // 最大测试时间
  timeout: 30 * 1000,

  // 每个测试的期望超时
  expect: {
    timeout: 5000,
  },

  // 并行运行测试
  fullyParallel: true,

  // CI 环境下失败时重试
  retries: process.env.CI ? 2 : 0,

  // 并行工作进程数
  workers: process.env.CI ? 1 : undefined,

  // 测试报告
  reporter: [
    ['html'],
    ['list'],
  ],

  // 共享设置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:5173',

    // 截图设置
    screenshot: 'only-on-failure',

    // 视频录制
    video: 'retain-on-failure',

    // 追踪
    trace: 'on-first-retry',
  },

  // 配置测试项目
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],

  // 开发服务器
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
