# 我的记账本儿 · Mobile Web

面向个人使用的移动优先记账网站，零前端依赖，可直接部署至 GitHub Pages。支持手动记收入/支出、三级分类、时间/金额记录、明细筛选、饼图、折线图、编辑/删除，以及 CSV/JSON 导入导出。支持安装到手机主屏幕（PWA）。

## 第一次打开

1. 默认提供明确标记的 **演示数据**，绝不是你真实的 Notion 账单。
2. 第一次新增真实账单时，演示账单自动清空。也可在「我的」页面手动清空。
3. 初始是 **本机模式**：数据存在浏览器 localStorage；清除浏览器数据就会丢失。换设备**不会自动同步**。
4. 在「我的」页面可以导出 CSV/JSON 做备份，并导入本机 JSON/CSV。

## 一、GitHub Pages 上线（无需构建）

1. 用自己的 GitHub 账号新建一个 **Public** 仓库，推荐名称 `my-ledger-mobile`。
2. 把本项目 **根目录内的全部文件和文件夹** 上传到仓库根目录（`index.html` 一定要在根目录）。**不要提交任何 Notion Token、密码或个人账本导出的数据。**
3. 进入 `Settings → Pages` → `Build and deployment` → Source 选择 `Deploy from a branch`，分支 `main`，路径 `/(root)`，点击 Save。
4. 用手机打开 `https://sxper193.github.io/my-ledger-mobile/`（仓库名如果不同，URL 最后一段也要相应变化）。
5. 手机浏览器菜单选择「添加到主屏幕」，即可像 App 一样打开。

> GitHub Pages 是静态网站托管：只发布网页，**不会替你保存跨设备账单，也不能安全地直接连接 Notion Token**。要把现有 Notion 作为共享数据库，请继续第二部分。

## 二、连接现有 Notion 账本（可选，但建议）

本项目提供了 Cloudflare Worker 安全代理，能读写你现有的 Notion 数据库。网页中只填写 Worker HTTPS 地址和独立访问密码，Notion API Token 只放在 Worker 的秘密配置中，不暴露在网站代码里。

### 2.1 配置 Notion Integration

1. 在 [Notion integrations](https://www.notion.so/profile/integrations) 创建 Internal integration，授予 **Read content / Insert content / Update content** 权限。
2. 在 Notion 打开「我的记账本儿｜消费明细」数据库，通过 Connections / Add connections 授权此 integration 访问这个数据库。
3. 复制 Notion integration token。**不要把 Token 填在网页设置里，也不要提交 GitHub。**

目前兼容 Notion 数据源 ID：`8c953962-975d-4997-9471-155f525d7e43`。它已填在 `worker/wrangler.toml`。如果你将来换数据库，需更新这个 ID 并保证数据库字段名称和类型一致。

匹配现有 Notion 数据库字段：`消费项目`(title)、`金额(元)`(number)、`收支类型`(select)、`日期`(date)、`时间`(rich_text)、`一级分类`(rich_text)、`二级分类`(rich_text)、`三级分类`(rich_text)、`商家`(rich_text)、`备注`(rich_text)、`记录来源`(select)、`使用场景`(select)。

### 2.2 发布 Cloudflare Worker

需要一个 Cloudflare 账号（免费层通常足够轻量个人使用），本地安装 Node.js 后：

```bash
cd worker
npx wrangler login
npx wrangler deploy
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put USER_PASSWORD
```

`NOTION_TOKEN` 填 Notion Integration 的密钥；`USER_PASSWORD` 设置一个长且随机、独立于其他账号的密码（建议至少 20 位）。也可以在 Cloudflare Dashboard 的 `Workers & Pages → Worker → Settings → Variables and Secrets` 添加这两项 Secret。

> 首次部署若未设置 secrets，接口会暂时返回「尚未完成配置」；录入两项 Secret 后才能访问。所有云端操作都需要该密码。

### 2.3 手机端连接

在网页「我的」页面填写：

- 安全同步接口地址：你的 Worker 的 `https://...workers.dev` 地址。
- 访问密码：你设置的 `USER_PASSWORD`，**不是 Notion Token**。

连接成功后：

- 直接显示 Notion 中的真实账单。
- 新增、修改、删除直接写入 Notion；手机刷新后可以读取其他端新增的数据。
- ChatGPT 在 Notion 中记的账，在网页端点击「刷新同步」即可获取。
- 断网时云端操作会失败，不会假装保存成功。
- 密码存在当前标签页的 `sessionStorage`，关闭标签页可能需要重新输入。

### 安全边界

- GitHub Pages 网页本身可被别人打开；本机数据只存在自己的浏览器。
- Worker 依赖强访问密码阻止他人查看或改写云端账本。请勿公开密码；可进一步为 Worker 添加 Cloudflare Access、速率限制等防护。
- 网站不会存储 Notion Token，Worker 通过 Cloudflare Secret 获取 Token。
- 不应把真实个人交易数据提交到公开 GitHub 仓库。
- Notion 云端模式与浏览器本机模式是两份账本；**不会自动合并**。请不要把演示数据当作真实记录。

## 三、项目结构

```text
index.html             静态入口与记账编辑表单
styles.css             移动端响应式视觉设计
app.js                 本地数据、视图、图表和 CRUD
sw.js                  离线资源缓存
manifest.webmanifest   PWA 安装配置
assets/icon.svg        网站图标
worker/index.mjs       Notion API 安全代理（Cloudflare Worker）
worker/wrangler.toml   Worker 公共配置（不包含密钥）
```

## 本地调试

浏览器打开 `index.html` 即可预览绝大多数功能。需要测试 PWA 和 Service Worker 时，用本地静态 HTTP 服务：

```bash
python3 -m http.server 8080
```

再打开 http://localhost:8080 。

## 说明

- 当前使用原生 SVG 实现曲线图，CSS 圆锥渐变实现饼图，无第三方图表依赖。
- 版本暂不含账户系统和照片票据 OCR。
- 单人使用为主；如日后支持多人，请增加正式身份认证与独立数据访问权限。