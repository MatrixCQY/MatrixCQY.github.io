# GitHub 个人主页修改完全指南

本指南将教您如何管理和更新您的个人学术网站。您的网站基于 [Jekyll](https://jekyllrb.com/) 和 [Academic Pages](https://github.com/academicpages/academicpages.github.io) 模板构建。

---

## 1. 核心配置文件：`_config.yml`
**作用**：控制全站的标题、个人信息、社交链接等全局设置。

### **如何修改网站标题和基本信息**
打开项目根目录下的 `_config.yml` 文件：

- **网站标题** (浏览器标签页显示):
  ```yaml
  title: "MatrixCQY"  # 这里修改您想要的标题
  ```
- **个人姓名**:
  ```yaml
  name: "Qiyang CHENG"
  ```
- **侧边栏个人信息**:
  找到 `author:` 部分：
  ```yaml
  author:
    name: "Qiyang CHENG"
    bio: "PhD Student at CUHK"
    location: "Hong Kong, China"
    # ... 其他信息
  ```

---

## 2. 修改页面内容：`_pages/` 目录
**作用**：控制导航栏点击进去的具体页面内容（如 About, CV, Publications 等）。

### **常见页面文件**
- **Publications (发表论文)**: `_pages/publications.html`
  - 这里的文字就是您刚才要求修改的 "Coming Soon....."。
- **CV (简历)**: `_pages/cv.md`
- **Teaching (教学)**: `_pages/teaching.md`
- **About (首页/关于)**: `_pages/about.md` (通常作为首页内容)

**修改方法**：直接用编辑器打开对应的 `.md` 或 `.html` 文件，修改其中的文字内容即可。

---

## 3. 添加/管理论文：`_publications/` 目录
**作用**：专门存放每篇论文的详细页面。

### **如何添加一篇新论文**
1. 进入 `_publications/` 文件夹。
2. 复制现有的一个 `.md` 文件（例如 `2009-10-01-paper-title-number-1.md`）。
3. **重命名**文件：格式必须是 `YYYY-MM-DD-您的论文标题.md`。
4. **编辑内容**：
   ```yaml
   ---
   title: "您的论文标题"
   collection: publications
   permalink: /publication/2024-01-01-paper-title # 确保这里与文件名日期对应
   excerpt: '这是论文的简短摘要...'
   date: 2024-01-01
   venue: '发表期刊/会议名称'
   paperurl: 'http://论文的PDF链接'
   citation: '您的引用格式'
   ---
   这里可以写论文的详细摘要或补充信息。
   ```

---

## 4. 发布上线 (Deploy)
每次您在本地修改完文件后，都需要通过 Git 命令推送到 GitHub，网站才会更新。

### **发布三部曲（在终端运行）**

1.  **添加到暂存区**：
    ```powershell
    git add .
    ```
    *(注意 add 后面有个空格和点)*

2.  **提交更改说明**：
    ```powershell
    git commit -m "这里写您改了什么，比如 Update homepage"
    ```

3.  **推送到 GitHub**：
    ```powershell
    git push origin master
    ```

**等待生效**：推送成功后，通常等待 1-2 分钟，刷新您的网站即可看到变化。

---

## 5. 常见问题
- **图片不显示？**
  确保图片放在 `images/` 目录下，并且在代码中引用路径正确（例如 `src="/images/profile.png"`）。
- **网站没更新？**
  去 GitHub 仓库的 **Actions** 页面查看是否有报错（红叉）。如果是绿勾，尝试强制刷新浏览器（Ctrl + F5）。
