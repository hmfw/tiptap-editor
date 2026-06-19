# 发布指南

## 当前状态 ✅

### 已完成
- ✅ 代码已提交到 GitHub
- ✅ 版本已升级到 v1.1.0
- ✅ Git tag 已推送
- ✅ 库已构建成功
- ✅ README 已恢复为 GitHub 版本

### GitHub
- 提交: `370c193` - "chore: 升级 Tiptap 到 3.27.0 并添加完整测试套件"
- 标签: `v1.1.0`
- 查看: https://github.com/hmfw/tiptap-editor

---

## npm 发布失败原因

### 错误信息
```
404 Not Found - PUT https://registry.npmjs.org/@mario9%2ftiptap-editor
```

### 可能原因
1. ❌ **未登录 npm** - `npm whoami` 返回 401 Unauthorized
2. ⚠️ **@mario9 scope 权限问题** - 可能不属于当前用户
3. ⚠️ **首次发布 scoped 包** - 需要 `--access public`

---

## 发布步骤

### 步骤 1: 登录 npm

```bash
npm login
```

输入：
- **Username**: 你的 npm 用户名
- **Password**: 密码
- **Email**: 邮箱
- **OTP** (如果启用了 2FA): 验证码

验证登录：
```bash
npm whoami
# 应该显示你的用户名
```

### 步骤 2: 准备发布

确保使用正确的 README（npm 版本，使用 CDN 图片）：

```bash
# 备份 GitHub README
cp README.md README-GITHUB.md

# 使用 npm README
cp README-NPM.md README.md
```

### 步骤 3: 发布到 npm

#### 选项 A: 如果 @mario9 是你的 npm scope
```bash
npm publish --access public
```

**注意**: scoped 包（@开头）默认是私有的，首次发布需要 `--access public`

#### 选项 B: 如果 @mario9 不是你的 scope

你需要修改 `package.json` 中的包名：

```json
{
  "name": "@your-npm-username/tiptap-editor"
  // 或者使用无 scope 的名字
  // "name": "tiptap-editor-vue3"
}
```

然后：
```bash
# 重新升级版本（因为改了包名）
npm version 1.1.0 --no-git-tag-version

# 发布
npm publish --access public
```

### 步骤 4: 恢复 GitHub README

发布成功后：
```bash
# 恢复 GitHub 版本
cp README-GITHUB.md README.md
rm README-GITHUB.md

# 提交
git add README.md
git commit -m "chore: 恢复 GitHub 版本 README"
git push
```

---

## 一键发布脚本

创建一个发布脚本方便以后使用：

```bash
#!/bin/bash
# publish.sh

set -e

echo "📦 准备发布..."

# 1. 构建
echo "🔨 构建库..."
pnpm build:lib

# 2. 替换 README
echo "📝 使用 npm 版本 README..."
cp README.md README-GITHUB.md
cp README-NPM.md README.md

# 3. 发布
echo "🚀 发布到 npm..."
npm publish --access public

# 4. 恢复 README
echo "✅ 恢复 GitHub README..."
cp README-GITHUB.md README.md
rm README-GITHUB.md

# 5. 提交 README
git add README.md
git commit -m "chore: 恢复 GitHub 版本 README" || true
git push

echo "🎉 发布成功！"
echo "🔗 查看: https://www.npmjs.com/package/@mario9/tiptap-editor"
```

使用：
```bash
chmod +x publish.sh
./publish.sh
```

或者添加到 `package.json`:
```json
{
  "scripts": {
    "prepublishOnly": "pnpm build:lib && cp README-NPM.md README.md",
    "postpublish": "cp README-GITHUB.md README.md || true"
  }
}
```

---

## 验证发布

### 1. 检查 npm 官网
```
https://www.npmjs.com/package/@mario9/tiptap-editor
```

验证：
- ✅ 版本号是 1.1.0
- ✅ README 显示正常（图片使用 CDN）
- ✅ 文件列表正确

### 2. 安装测试
```bash
# 创建测试项目
mkdir test-install
cd test-install
npm init -y
npm install @mario9/tiptap-editor@1.1.0

# 检查安装
ls node_modules/@mario9/tiptap-editor/dist/
```

### 3. 检查 jsDelivr CDN
图片应该可以通过 CDN 访问：
```
https://cdn.jsdelivr.net/npm/@mario9/tiptap-editor@1.1.0/README.md
```

---

## 常见问题

### Q: 发布失败 - 401 Unauthorized
A: 需要先登录 npm:
```bash
npm login
```

### Q: 发布失败 - 404 Not Found
A: 
1. 检查包名是否正确
2. 如果是 scoped 包（@开头），确保 scope 属于你
3. 首次发布 scoped 包需要 `--access public`

### Q: 发布失败 - 403 Forbidden
A: 
1. 你没有权限发布到这个 scope
2. 包名已被其他人占用

### Q: 如何撤销发布？
A: 
```bash
# 24 小时内可以撤销
npm unpublish @mario9/tiptap-editor@1.1.0

# 注意：npm 不推荐 unpublish，应该发布新版本修复
```

### Q: 如何更新包？
A:
```bash
# 修改代码后
npm version patch  # 1.1.0 -> 1.1.1
# 或
npm version minor  # 1.1.0 -> 1.2.0
# 或
npm version major  # 1.1.0 -> 2.0.0

# 构建并发布
pnpm build:lib
npm publish
```

---

## 发布清单

发布前检查：

- [ ] 代码已提交到 GitHub
- [ ] 版本号已更新
- [ ] Git tag 已推送
- [ ] 库已构建（`pnpm build:lib`）
- [ ] README 使用 npm 版本（CDN 图片）
- [ ] 已登录 npm（`npm whoami`）
- [ ] package.json 中的 name、version 正确
- [ ] 测试通过（`pnpm test`）

发布后检查：

- [ ] npm 官网显示正常
- [ ] README 图片显示正常
- [ ] 可以正常安装
- [ ] GitHub README 已恢复

---

## 下次发布流程

1. **修改代码**
2. **运行测试**: `pnpm test`
3. **升级版本**: `npm version patch/minor/major`
4. **推送**: `git push && git push --tags`
5. **构建**: `pnpm build:lib`
6. **发布**: `./publish.sh` 或手动执行上述步骤

---

**当前状态**: 准备就绪，等待 npm 登录后发布  
**版本**: v1.1.0  
**下一步**: 运行 `npm login` 然后 `npm publish --access public`
