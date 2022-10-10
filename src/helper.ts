import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as url from 'url';
import axios from 'axios';

export const getSourcePath = (context: vscode.ExtensionContext, relativePath: string): vscode.Uri => {
  const absPath = path.join(context.extensionPath, relativePath);
  const disk = vscode.Uri.file(absPath);

  return disk.with({ scheme: 'vscode-resource' });
};

export const removeDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    return;
  }
  let files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    let newPath = path.join(dir, files[i]);
    let stat = fs.statSync(newPath);
    if(stat.isDirectory()){
      removeDir(newPath);
    } else {
     //删除文件
      fs.unlinkSync(newPath);
    }
  }
  fs.rmdirSync(dir);
};

export const getLoadingPage = (context: vscode.ExtensionContext): string => {
  const html = getLoadingHtml(context);
  return getHtml(context, html);
};

export const getLoadingHtml = (context: vscode.ExtensionContext): string => {
  const imgPath = getSourcePath(context, 'logo.svg');
  const html = `
    <div class="loading-container">
      <div class="loading">
          <img class="loading-img" src="${imgPath}" alt="loading">
          <h1>Loading...</h1>
      </div>
    </div>
  `;
  return html;
};

export const getHtml = (
  context: vscode.ExtensionContext,
  html: string,
  artstation = false,
): string => {
  const cssPath = getSourcePath(context, 'template/styles.css');
  const artstationJS = getSourcePath(context, 'template/artstation.js');
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Artstation</title>
      <link rel="stylesheet" href="${cssPath}" media="screen" />
  </head>
  <body>
    ${html}
    ${artstation ? `<script src="${artstationJS}"></script>` : ''}
  </body>
  </html>
  `;
};

export const randomString = (length = 32): string => {
  const token = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let res = '';
  for (let i = 0; i < length; i++) {
    res += token.charAt(Math.floor(Math.random() * token.length));
  };
  return res;
};

export const getCookie = (cookie: string, name: string): string => {
  const parts = cookie.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(';').shift() as string;
  }
  return '';
};

export const downloadFile = async (
  url: string,
  filePath: string,
): Promise<boolean> => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  if (response.status === 302) {
    return downloadFile(response.headers.location as string, filePath);
  }
  if (response.status !== 200) {
    throw new Error(`HTTP STATUS: ${response.status}`);
  }
  const file = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    file.on('finish', () => {
      file.close();
      resolve(true);
    });
    file.on('error', err => reject(err));

    response.data.pipe(file);
  });
};

export const validWallpaperPath = (): boolean => {
  const configure = vscode.workspace.getConfiguration('artstation');
  const wallpaperPath = configure.get('wallpaperPath') as string;
  if (!wallpaperPath) {
    vscode.window.showErrorMessage([
      'Please set wallpaper save path.',
      '请先设置壁纸保存路径',
    ].join(' '));
    return false;
  }
  if (!fs.lstatSync(wallpaperPath).isDirectory()) {
    vscode.window.showErrorMessage([
      'Wallpaper save path is incorrect',
      '壁纸保存路径不正确',
    ].join(' '));
    return false;
  }
  return true;
};

export const getWallpaperPath = (imageUrl: string): string => {
  const configure = vscode.workspace.getConfiguration('artstation');
  const wallpaperPath = configure.get('wallpaperPath') as string;

  const pathname = url.parse(imageUrl).pathname;
  const basename = path.basename(pathname as string);
  const filePath = path.join(wallpaperPath, `${randomString(5)}-${basename}`);
  return filePath;
};
