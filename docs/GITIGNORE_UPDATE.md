# .gitignore 更新说明

## 更新时间
2026-06-19

## 更新原因
添加了 Playwright E2E 测试框架后，会生成测试结果、报告和缓存文件，这些文件不应该提交到 Git 仓库。

## 新增忽略项

```gitignore
# Playwright
.playwright-cli/          # 已有
test-results/             # 新增 - 测试结果（截图、视频、日志）
playwright-report/        # 新增 - HTML 测试报告
playwright/.cache/        # 新增 - Playwright 浏览器缓存
```

## 各目录说明

### test-results/
**内容**: 每次测试运行生成的结果文件
- 截图（.png）
- 视频录像（.webm）
- 测试日志和上下文
- `.last-run.json` - 上次运行信息

**为什么忽略**: 
- 每次运行都会重新生成
- 文件体积大（视频文件）
- 本地调试用，不需要共享

### playwright-report/
**内容**: HTML 格式的测试报告
- `index.html` - 交互式测试报告
- 内嵌的截图和视频

**为什么忽略**:
- 每次运行都会重新生成
- 可以通过 `pnpm test:report` 重新生成
- 体积较大（~500KB+）

### playwright/.cache/
**内容**: Playwright 运行时缓存
- 浏览器实例缓存
- 临时文件

**为什么忽略**:
- 自动管理的缓存
- 不影响测试执行
- 可以重新生成

## 应该提交的文件

以下文件应该**提交**到 Git：

✅ **测试配置**
- `playwright.config.ts` - Playwright 配置文件

✅ **测试文件**
- `tests/*.spec.ts` - 所有测试用例
- `tests/` 整个目录

✅ **文档**
- `docs/TEST_*.md` - 测试相关文档
- `UPGRADE*.md` - 升级相关文档

✅ **依赖配置**
- `package.json` - 包含测试脚本和依赖
- `pnpm-lock.yaml` - 锁定依赖版本

## Git 状态检查

运行 `git status` 应该看到：

```
修改的文件:
  M .gitignore
  M package.json
  M pnpm-lock.yaml
  M README.md

新文件:
  ?? playwright.config.ts
  ?? tests/
  ?? docs/TEST_*.md
  ?? UPGRADE*.md
  ?? PROJECT_COMPLETE.md

忽略的目录:
  test-results/       ✅ 已忽略
  playwright-report/  ✅ 已忽略
  node_modules/       ✅ 已忽略
  dist/               ✅ 已忽略
  dist-app/           ✅ 已忽略
```

## 验证

### 1. 检查 test-results 是否被忽略
```bash
git status | grep test-results
# 应该没有输出（表示已忽略）
```

### 2. 检查 playwright-report 是否被忽略
```bash
git status | grep playwright-report
# 应该没有输出（表示已忽略）
```

### 3. 确认测试文件会被跟踪
```bash
git status | grep tests/
# 应该显示 ?? tests/ （新文件）
```

## CI/CD 注意事项

如果将来在 CI/CD 中运行测试：

1. **测试结果上传** - 可以使用 GitHub Actions artifacts
   ```yaml
   - uses: actions/upload-artifact@v3
     if: always()
     with:
       name: playwright-report
       path: playwright-report/
   ```

2. **失败时保留** - 只在测试失败时上传截图和视频
   ```yaml
   - uses: actions/upload-artifact@v3
     if: failure()
     with:
       name: test-results
       path: test-results/
   ```

3. **缓存浏览器** - 缓存 Playwright 浏览器加速 CI
   ```yaml
   - uses: actions/cache@v3
     with:
       path: ~/.cache/ms-playwright
       key: playwright-${{ runner.os }}
   ```

## 常见问题

### Q: 如果我想查看队友的测试结果怎么办？
A: 运行 `pnpm test:report` 会生成新的 HTML 报告。或者使用 CI/CD artifacts。

### Q: test-results 占用太多磁盘空间怎么办？
A: 可以手动删除：
```bash
rm -rf test-results/
```
下次运行测试会重新生成。

### Q: 我不小心提交了 test-results/ 怎么办？
A: 从 Git 历史中删除：
```bash
git rm -r --cached test-results/
git commit -m "chore: 从 Git 中移除 test-results/"
```

### Q: 为什么不提交测试报告？
A: 
1. 每次运行都会变化（时间戳、结果）
2. 造成大量 Git diff 噪音
3. 报告可以从测试代码重新生成
4. CI/CD 可以自动生成和上传

## 总结

✅ `.gitignore` 已更新
✅ Playwright 生成的临时文件会被忽略
✅ 测试代码和配置会被跟踪
✅ 减少 Git 仓库体积
✅ 避免无意义的 diff

---

**更新者**: Claude Code  
**检查状态**: ✅ 验证通过  
**影响**: 无破坏性影响，仅优化 Git 工作流
