# Tiptap 升级指南

## 从 3.22.5 升级到 3.27.0

### 升级日期
2026-06-19

### 版本变更
- **从**: 3.22.5
- **到**: 3.27.0
- **跨越版本**: 3.23.x, 3.24.0, 3.25.0, 3.26.x, 3.27.x

### 主要改进

#### 1. ProseMirror 底层依赖升级
- `prosemirror-view`: 1.38.1 → 1.41.8
- `prosemirror-model`: 1.24.1 → 1.25.7
- `prosemirror-transform`: 1.10.2 → 1.12.0
- `prosemirror-tables`: 1.6.4 → 1.8.0
- 新增 `prosemirror-inputrules`: 1.4.0

#### 2. 已知改进
- 修复表格单元格选择时的纯文本复制问题
- 每个选中范围独立序列化并按文档顺序连接
- 修复 Twitch 和 YouTube 嵌入在重新加载 HTML 时丢失 URL 的问题
- 修复内联代码 markdown 快捷键前输入字符会删除前置字符的问题

### 兼容性评估

#### ✅ 向后兼容
这是小版本号升级（3.22 → 3.27），根据语义化版本规范应该保持向后兼容。

#### ⚠️ 需要注意的点
1. **表格功能**：如果你的应用大量使用表格，需要重点测试表格的选择、复制、粘贴功能
2. **自定义扩展**：如果你基于 ProseMirror 底层 API 编写了自定义扩展，需要检查 API 兼容性
3. **输入规则**：新增的 `prosemirror-inputrules` 可能影响 markdown 快捷键行为

### 升级步骤

#### 对于库的消费者
如果你的项目使用了 `@hmfw/tiptap-editor`，需要更新 peer dependencies：

```bash
# 更新所有 @tiptap 相关包到 3.27.x
pnpm update @tiptap/core @tiptap/extension-* @tiptap/pm @tiptap/starter-kit @tiptap/vue-3
```

或者重新安装：

```bash
pnpm install @tiptap/core@^3.27.0 @tiptap/extension-bubble-menu@^3.27.0 \
  @tiptap/extension-code-block-lowlight@^3.27.0 @tiptap/extension-highlight@^3.27.0 \
  @tiptap/extension-horizontal-rule@^3.27.0 @tiptap/extension-image@^3.27.0 \
  @tiptap/extension-list@^3.27.0 @tiptap/extension-mathematics@^3.27.0 \
  @tiptap/extension-placeholder@^3.27.0 @tiptap/extension-subscript@^3.27.0 \
  @tiptap/extension-superscript@^3.27.0 @tiptap/extension-table@^3.27.0 \
  @tiptap/extension-text-align@^3.27.0 @tiptap/extension-typography@^3.27.0 \
  @tiptap/extensions@^3.27.0 @tiptap/pm@^3.27.0 @tiptap/starter-kit@^3.27.0 \
  @tiptap/vue-3@^3.27.0
```

#### 对于库的开发者
1. 已更新 `package.json` 中的 peerDependencies
2. 需要运行完整的测试套件
3. 需要手工测试关键功能

### 测试清单

- [ ] 基础编辑功能（输入、删除、撤销/重做）
- [ ] 文本样式（粗体、斜体、下划线、删除线）
- [ ] 标题和段落
- [ ] 列表（有序、无序、任务列表）
- [ ] 表格操作
  - [ ] 创建表格
  - [ ] 插入/删除行列
  - [ ] 选择单元格
  - [ ] 复制/粘贴表格内容
- [ ] 代码块与语法高亮
- [ ] 数学公式（内联和块级）
- [ ] 图片上传和对齐
- [ ] 链接插入和编辑
- [ ] 气泡菜单
- [ ] 只读模式
- [ ] 类型检查通过
- [ ] 构建成功（应用模式和库模式）

### 回滚方案

如果升级后出现问题，可以回滚到 3.22.5：

```bash
git checkout HEAD -- package.json
pnpm install
```

### 参考资料

- [Tiptap Changelog](https://tiptap.dev/docs/resources/changelog/core)
- [Tiptap GitHub](https://github.com/ueberdosis/tiptap)
- [ProseMirror Changelog](https://prosemirror.net/docs/changelog/)

### 后续计划

1. 完成本次升级测试
2. 监控社区反馈
3. 每 2-3 个月检查一次 Tiptap 更新
4. 跟踪 Tiptap 4.x 的开发进度（如果有）
