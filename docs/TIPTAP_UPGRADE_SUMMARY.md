# Tiptap 升级总结报告

## 执行时间
2026-06-19

## 升级概览

### 版本变更
```
@tiptap/* 组件: 3.22.5 → 3.27.0
```

### 升级的包（共 18 个）
所有 @tiptap 相关的 peerDependencies 已更新到 `^3.27.0`：

1. `@tiptap/core`
2. `@tiptap/extension-bubble-menu`
3. `@tiptap/extension-code-block-lowlight`
4. `@tiptap/extension-highlight`
5. `@tiptap/extension-horizontal-rule`
6. `@tiptap/extension-image`
7. `@tiptap/extension-list`
8. `@tiptap/extension-mathematics`
9. `@tiptap/extension-placeholder`
10. `@tiptap/extension-subscript`
11. `@tiptap/extension-superscript`
12. `@tiptap/extension-table`
13. `@tiptap/extension-text-align`
14. `@tiptap/extension-typography`
15. `@tiptap/extensions`
16. `@tiptap/pm`
17. `@tiptap/starter-kit`
18. `@tiptap/vue-3`

## 关键改进

### 1. ProseMirror 底层升级
核心编辑引擎 ProseMirror 的多个包得到升级：

| 包名 | 旧版本 | 新版本 | 重要性 |
|------|--------|--------|--------|
| prosemirror-view | 1.38.1 | 1.41.8 | 🔴 高 - 渲染层核心 |
| prosemirror-model | 1.24.1 | 1.25.7 | 🔴 高 - 文档模型 |
| prosemirror-tables | 1.6.4 | 1.8.0 | 🟡 中 - 表格功能 |
| prosemirror-transform | 1.10.2 | 1.12.0 | 🟡 中 - 文档变换 |

### 2. 已修复的 Bug
基于 [Tiptap Changelog](https://tiptap.dev/docs/resources/changelog/core) 的研究：

- ✅ **表格复制问题**: 修复纯文本复制表格单元格时包含未选中单元格内容的问题
- ✅ **嵌入内容**: 修复 Twitch/YouTube 嵌入重新加载后丢失 URL
- ✅ **Markdown 快捷键**: 修复内联代码快捷键前输入字符会删除前置字符

### 3. 性能和稳定性提升
- 更新的 ProseMirror 引擎带来性能优化
- 表格操作更加稳定
- 输入规则处理更加健壮

## 验证结果

### ✅ 类型检查
```bash
pnpm exec vue-tsc --noEmit
```
**结果**: 通过，无类型错误

### ✅ 库构建
```bash
pnpm build:lib
```
**结果**: 成功构建
- ES 模块: `dist/tiptap-editor.js` (64.00 kB, gzip: 16.07 kB)
- UMD 模块: `dist/tiptap-editor.umd.cjs` (52.30 kB, gzip: 14.88 kB)
- 样式文件: `dist/tiptap-editor.css` (1,537.72 kB, gzip: 957.86 kB)
- 类型定义: `dist/index.d.ts`

## 兼容性评估

### 向后兼容性
- ✅ **API 层面**: 小版本升级，保持向后兼容
- ✅ **类型定义**: TypeScript 类型检查通过
- ✅ **构建系统**: Vite 构建成功，无警告
- ⚠️ **运行时测试**: 需要手工测试确认

### 破坏性变更
经分析，从 3.22.5 到 3.27.0 **无已知的破坏性变更**。

## 建议的测试重点

### 高优先级 🔴
1. **表格功能**
   - 创建、编辑、删除表格
   - 行列操作（插入、删除、移动）
   - 单元格选择和复制粘贴
   - 原因: prosemirror-tables 有大版本跳跃

2. **代码块**
   - 语法高亮
   - Markdown 快捷键（```语言名）
   - 原因: 已知有输入规则修复

3. **数学公式**
   - 内联公式
   - 块级公式
   - 编辑对话框
   - 原因: 依赖 ProseMirror 核心 API

### 中优先级 🟡
4. **图片功能**
   - 上传（Base64 和自定义上传）
   - 对齐（左/中/右）
   - 控件操作

5. **链接和嵌入**
   - 链接插入和编辑
   - 如有使用 YouTube/Twitch 嵌入需重点测试

6. **基础编辑**
   - 撤销/重做
   - 文本样式（粗体、斜体等）
   - 列表操作

### 低优先级 🟢
7. **只读模式**
8. **Placeholder**
9. **气泡菜单**
10. **文本对齐**

## 推荐的发布流程

### 方案 A: 保守发布（推荐）
1. 发布为新的 minor 版本：`1.1.0`
2. 在 README 中说明已升级到 Tiptap 3.27
3. 监控 GitHub Issues 一周
4. 如无问题，标记为稳定版本

### 方案 B: Beta 测试
1. 发布 `1.1.0-beta.1`
2. 在内部项目中测试 1-2 周
3. 收集反馈后发布正式版 `1.1.0`

## 其他依赖建议

### Element Plus
当前: `^2.13.0`  
最新: 需要检查（截至 2026-06）

### Lowlight
当前: `^3.3.0`  
最新: 需要检查

### KaTeX
当前: `^0.16.0`  
最新: 需要检查

建议在后续版本中也检查这些依赖的更新。

## 文档更新

已创建以下文档：
- ✅ `UPGRADE.md` - 详细的升级指南
- ✅ `docs/TIPTAP_UPGRADE_SUMMARY.md` - 本总结文档

建议在 README 中添加：
```markdown
## 版本历史

### v1.1.0 (待发布)
- ⬆️ 升级 Tiptap 到 3.27.0（从 3.22.5）
- 🐛 修复表格复制问题（上游修复）
- 🐛 修复 Markdown 快捷键问题（上游修复）
- ⚡ 性能优化（ProseMirror 底层升级）
```

## 下一步行动

### 立即执行
- [ ] 运行完整的手工测试套件（按优先级）
- [ ] 测试在真实项目中的集成
- [ ] 更新 README 版本说明

### 短期（1-2 周）
- [ ] 发布新版本（建议 1.1.0 或 1.1.0-beta.1）
- [ ] 监控用户反馈
- [ ] 检查其他依赖更新（element-plus, lowlight, katex）

### 长期
- [ ] 建立自动化测试（E2E）
- [ ] 设置依赖自动检查（Dependabot/Renovate）
- [ ] 每季度检查 Tiptap 更新
- [ ] 关注 Tiptap 4.x 开发（如有）

## 风险评估

### 风险等级: 🟢 低
- 小版本号升级，理论上向后兼容
- 类型检查和构建均通过
- 升级主要是 bug 修复和性能改进
- 无已知破坏性变更

### 缓解措施
- 完整的测试覆盖
- Beta 版本试用（可选）
- 保留回滚能力（Git 标签）
- 清晰的升级文档

## 参考资料

- [Tiptap 官方文档](https://tiptap.dev)
- [Tiptap Core Changelog](https://tiptap.dev/docs/resources/changelog/core)
- [ProseMirror 官网](https://prosemirror.net)
- [GitHub Releases](https://github.com/ueberdosis/tiptap/releases)

---

**报告生成**: Claude Code  
**审核状态**: 待人工审核  
**批准发布**: 待定
