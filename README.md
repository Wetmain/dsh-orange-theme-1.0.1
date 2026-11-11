# Orange theme（橙色主题）

把 DeepSeek Harness Web 界面的强调色改成橙色：发送消息按钮、品牌 logo 与文字（侧栏左上角、新会话 Hero 上方）、
左侧工作区的文件图标、运行中的「深度求索中」状态（文字、鲸鱼图标与扫光动画，动画本身保持不变），
以及主按钮、开关、链接、侧栏选中项等同一套强调色。

## 兼容性

- 目标：**DSH 0.2.2-rc.1**（本插件开发时所用的版本）。同一版本族的 Web GUI 一般可直接使用。
- 纯 JavaScript，**无第三方依赖、无构建步骤**，不区分操作系统：Windows / macOS / Linux 的
  DSH Desktop 或 `dsh web` 均可。
- 依赖 DSH 自身提供的 `theme` 客户端服务（`overrideTokens`）与 DSH 的 `--dsw-alias-*` 主题
  token、CSS Module 类名后缀（`_brand`、`_fish`、`_fileIcon` 等）。若目标机器的 DSH 版本差异较大，
  这些名称可能变化，需要按新版调整 `client.js` 中的选择器或 token 名。
- 可选：装了 `dsh-better-sidebar` 时，其文件树图标也会被一并调成橙色；没装则只影响 DSH 自带文件树。

## 安装

1. 复制整个 `dsh-orange-theme` 文件夹（或解压随附的 zip），放到目标电脑上一个**固定路径**。
   安装后 profile 用 `link:` 指向该目录，之后不能删除或移动它。
2. 任选一种方式注册为 profile 插件：
   - 在目标机器的 DSH 会话里对 agent 说：`安装本地插件包 <绝对路径>\dsh-orange-theme`
     （agent 会用 `plugin_manager install_bundle`；需要该会话具备 danger-full-access 或允许审批）；
   - 若终端里有 `dsh` 命令：`dsh plugin --profile <profile> add <绝对路径>\dsh-orange-theme`；
   - 或在 Web 的 **插件 / Plugins** 页用安装入口指向该目录。
3. 安装完成后刷新页面（`Ctrl+R`）即可看到橙色。

安装会在目标机器的 profile 里写入依赖与 bundle 选择，重启后仍然生效，对所有会话生效。

## 自定义颜色

编辑 `client.js` 顶部的常量，然后在 插件页 把「橙色主题」关开一次或刷新页面：

| 常量 | 用途 | 当前值 |
|---|---|---|
| `LIGHT_ACCENT` / `DARK_ACCENT` | 品牌、主按钮、链接、文件图标 | `#ea580c` / `#fb923c` |
| `LIGHT_HOVER` / `DARK_HOVER` | 主按钮 hover | `#c2410c` / `#fdba74` |
| `LIGHT_SEND` / `DARK_SEND` | 发送按钮底色 | `#ea580c` / `#f97316` |
| `LIGHT_TINT` / `DARK_TINT` | 侧栏选中项底色 | `#ffedd5` / `#7c2d12` |
| `LIGHT_DIVING` / `DARK_DIVING` | 「深度求索中」文字与鲸鱼图标 | `#c2410c` / `#fb923c` |
| `LIGHT_DIVING_SHIMMER` / `DARK_DIVING_SHIMMER` | 「深度求索中」扫光高亮 | `#7c2d12` / `#fdba74` |

## 停用与卸载

在 插件页 关掉「橙色主题」，或卸载该 bundle，界面立即恢复原来的强调色。

## 目录结构

- `client.js` — 全部实现：theme token 覆盖层 + 品牌/文件图标样式
- `index.js` — Host 半边（空实现，仅占位 bundle 行）
- `cordis.patch.yml` — bundle 补丁，插入 `orange-theme` 行
- `package.json` — bundle 声明、Client 模块入口与依赖顺序
- `locale/en.json`、`locale/zh.json` — 插件列表里的标题与说明
- `icon.svg` — 插件图标

## 实现摘要

- `theme.overrideTokens('<source>', { token: { light, dark } })` 叠加一层 token 覆盖，
  DSH 的主题呈现器把它写到 `<body>` 的行内自定义属性上；卸载时这层被移除，原配色自动恢复。
- 品牌图形（鲸鱼 logo、字标、Hero 标题与鱼）与多色语言文件图标用 `currentColor`/自带颜色绘制，
  由一段插件自己的 `<style>` 覆盖；选择器匹配 CSS Module 的类名后缀，因此重新构建换 hash 也能命中。
- 「深度求索中」只用两个 token 覆盖 `--dsw-alias-label-deep-diving`（文字与鲸鱼 base 色）和
  `--dsw-alias-label-deep-diving-shimmer`（扫光高亮色）。聊天插件的 `.running` 块把自己的
  `--dsw-alias-label-shimmer` 映射到后者，因此只换颜色，`mask`、`animation`、关键帧全部沿用原样。
