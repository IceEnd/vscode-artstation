# ArtStation

<p align="center">
  <img src="https://user-images.githubusercontent.com/11556339/193990898-7d579cec-52d1-4221-ae35-5d4f8661f7f2.png" width="120"/>
  <h2 align="center">VSCode-Artstation</h2>
  <p align="center">Artstation for VS Code.</p>
  <p align="center">
    <a target="__blank" href="https://marketplace.visualstudio.com/items?itemName=Alchemy.artstation">
      <img src="https://vsmarketplacebadge.apphb.com/version/Alchemy.artstation.svg?style=flat-square&logo=visual-studio-code" />
    </a>
    <a target="__blank" href="https://github.com/IceEnd/vscode-artstation/actions">
      <img src="https://github.com/IceEnd/vscode-artstation/actions/workflows/ci.yml/badge.svg">
    </a>
  </p>
</p>


[English](./README.md) | [中文](./README.zh-CN.md)

## 功能

- 在 VS Code 中浏览 Artstattion
- 一键设置系统壁纸

|    SCREEN | SHOT |
|-------:|:-----|
| ![image](https://user-images.githubusercontent.com/11556339/193978773-d9b93e2e-3d4d-4c67-bf75-f0d9a9683be6.png) | ![image](https://user-images.githubusercontent.com/11556339/193978873-6e3e797b-5783-4554-8fa5-cde9648ccc4b.png) |

## 使用

step 1. 在商店里搜索 artstation 安装即可。

step 2. 设置壁纸路径

首先在插件设置中壁纸在本地的保存路径，后续壁纸都将会下载至此文件夹。

![congig](https://user-images.githubusercontent.com/11556339/194198589-8ea4acfc-7899-4bf0-b4ee-791ba75864fe.png)

step 3. 如果有 artstation 账号，可以访问网站，随便找一个请求，复制 请求头的 cookie 部分。回到 VS Code ，打开输入命令 artstation login，粘贴 cookie 。

![login](https://user-images.githubusercontent.com/11556339/194199176-ad5d5abb-3b27-4e9f-b57e-ecd1afe6e6f8.png)

step 4. 后续执行 artstation start 就可以打开 artstation 了。

step 5. MacOS 和 Windows 下如果要一键设置壁纸（**linux**用户可以忽略），则需要先执行 artstation install，这会先从 github 上下载对应的壁纸设置二进制文件。artstation uninstall 可以删除该二进制文件。 

![wallpaper](https://user-images.githubusercontent.com/11556339/194199739-6347b0dd-26d3-434b-9568-9aa3efd45ce3.png)

## 命令

| Name                      | Description                                 |
| :------------------------ | :------------------------------------------ |
| `Artstation login`        | 输入 Artstation 的 cookie 进行登录           |
| `Artstation start`        | 启动 Artstation                             |
| `Artstation install`      | 下载安装壁纸插件                             |
| `Artstation uninstall`    | 卸载壁纸插件                                 |

## Config

| Name                            |      Type       |   Default    | Description                |
| :------------------------------ | :-------------: | :----------: | :------------------------- |
| `artstation.wallpaperPath`      |    `string`     |     `''`     | 壁纸保存路径                |



## LICENSE

MIT
