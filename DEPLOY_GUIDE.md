# 如何修改并发布网站更新

每次您在本地修改了文件（比如改了文字、换了图片、调了样式），都需要执行以下步骤才能让网站在网上更新。

## 🚀 极简三步法（推荐）

打开您的终端（Terminal），确保目录在项目根目录下，然后依次输入：

### 1. 告诉 Git 哪些文件变了
```powershell
git add .
```
> **解释**：`.` 代表“当前目录下的所有文件”。这一步是把您的所有修改（包括新增、删除、编辑）都放到“待提交区”。

### 2. 给这次修改起个名字
```powershell
git commit -m "这里写修改说明"
```
> **解释**：`-m` 后面跟的是备注信息。
> *   比如改了简历：`git commit -m "Update CV"`
> *   比如换了头像：`git commit -m "Change profile photo"`
> *   如果不写 `-m "..."`，Git 会跳出一个复杂的文本编辑器，对新手不友好。

### 3. 推送到 GitHub（发布！）
```powershell
git push origin master
```
> **解释**：这一步是真正把代码上传到服务器。
> *   `origin` 是远程仓库的别名。
> *   `master` 是主分支的名称（有的项目叫 `main`，您的项目目前叫 `master`）。

---

## ⚡️ 进阶：如果报错了怎么办？

### 情况一：提示 `everything up-to-date`
**意思**：您本地没有新的修改，或者没有执行第 2 步 `commit`。
**解决**：检查是否保存了文件，确认是否执行了 `git add .` 和 `git commit`。

### 情况二：提示 `rejected` 或 `fetch first`
**意思**：GitHub 上的代码比您本地的新（可能是您直接在网页上改过东西，或者上次推送没成功）。
**解决**：
先拉取最新代码并合并：
```powershell
git pull --rebase origin master
```
如果顺利，它会显示 `Successfully rebased`。然后再次尝试推送：
```powershell
git push origin master
```

---

## 💡 小贴士
- **刷新缓存**：推送成功后，网站通常需要 1-2 分钟才会更新。如果还没变，请在浏览器按 `Ctrl + F5`（Windows）或 `Cmd + Shift + R`（Mac）强制刷新。
- **查看状态**：如果不确定自己改了哪些文件，可以随时输入 `git status` 查看。
