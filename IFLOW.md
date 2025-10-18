# 项目上下文：Hugo 静态博客

## 项目概述
这是一个使用 [Hugo](https://gohugo.io/) 静态站点生成器搭建的博客项目。Hugo 是一个用 Go 语言编写的快速、灵活的静态网站框架，特别适合用于博客和文档站点。

项目的核心配置文件是 `hugo.toml`，它定义了站点的基本信息，如：
- **baseURL**: `'https://example.org/'`
- **languageCode**: `'en-us'`
- **title**: `'My New Hugo Site'`

## 项目结构
Hugo 项目遵循其标准目录结构：
- **`archetypes/`**: 包含内容原型文件。`default.md` 为新创建的文章提供默认的 front matter 模板。
- **`assets/`**: 用于存放需要被 Hugo 处理的资源文件（如 SCSS, TypeScript）。
- **`content/`**: 存放网站的实际内容（Markdown 文件等）。当前此目录为空。
- **`data/`**: 存放数据文件（如 JSON, YAML, TOML），可在模板中使用。
- **`i18n/`**: 存放国际化翻译文件。
- **`layouts/`**: 存放自定义的 HTML 模板文件。当前此目录为空，意味着站点将使用默认主题或 `themes/` 目录中的主题。
- **`static/`**: 存放静态文件（如图片、CSS、JS），这些文件会被直接复制到最终的 `public/` 目录中。
- **`themes/`**: 存放 Hugo 主题。
- **`public/`**: Hugo 构建后生成的最终静态网站文件存放于此。

## 构建与运行
要本地预览和开发此博客，请确保已安装 Hugo。

1.  **启动本地服务器**:
    在项目根目录下运行以下命令，Hugo 会启动一个本地开发服务器，并自动监听文件变化进行热重载。
    ```bash
    hugo server
    ```

2.  **构建生产版本**:
    运行以下命令，Hugo 会将完整的静态网站生成到 `public/` 目录中，可用于部署。
    ```bash
    hugo
    ```

## 开发流程
1.  **创建新文章**:
    使用 Hugo CLI 创建一篇新文章，它会基于 `archetypes/default.md` 生成一个带有默认 front matter 的 Markdown 文件。
    ```bash
    hugo new posts/my-first-post.md
    ```
2.  **编辑内容**:
    在 `content/` 目录下编辑 Markdown 文件来撰写博客文章。
3.  **自定义样式和布局**:
    - 将自定义的 CSS/JS 文件放入 `static/` 目录。
    - 如需深度定制页面结构，可在 `layouts/` 目录下创建相应的模板文件，这将覆盖主题中的同名模板。
4.  **添加主题**:
    可以将下载的主题放入 `themes/` 目录，并在 `hugo.toml` 中通过 `theme = "your-theme-name"` 来启用它。