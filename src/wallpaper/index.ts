import * as vscode from 'vscode';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import * as os from 'os';
import * as wallpaper from 'wallpaper';
import * as macos from './macos';
import * as windows from './windows';
import { randomString } from '../helper';

const platform = os.platform();

/**
 * Set OS wallpaper
 * @param image picture url
 */
export const setWallpaper = async (context: vscode.ExtensionContext, image: string): Promise<void> => {
  const configure = vscode.workspace.getConfiguration('artstation');
  const wallpaperPath = configure.get('wallpaperPath') as string;
  const valid = validPath(wallpaperPath);
  if (!valid) {
    return;
  }
  const filePath = getWallpaperPath(image, wallpaperPath);
  let saveFlag = false;
  try {
    saveFlag = await saveWallpaper(image, filePath);
  } catch {
    vscode.window.showErrorMessage('Download wallpaper failed. 下载壁纸失败');
  }
  saveFlag && setOSWallpaper(context, filePath);
};

const validPath = (str: string): boolean => {
  if (!str) {
    vscode.window.showErrorMessage([
      'Please set wallpaper save path.',
      '请先设置壁纸保存路径',
    ].join(' '));
    return false;
  }
  if (!fs.lstatSync(str).isDirectory()) {
    vscode.window.showErrorMessage([
      'Wallpaper save path is incorrect',
      '壁纸保存路径不正确',
    ].join(' '));
    return false;
  }
  return true;
};

const getWallpaperPath = (imageUrl: string, wallpaperPath: string): string => {
  const pathname = url.parse(imageUrl).pathname;
  const basename = path.basename(pathname as string);
  const filePath = path.join(wallpaperPath, `${randomString(5)}-${basename}`);
  return filePath;
};

const saveWallpaper = (imageUrl: string, filePath: string): Promise<boolean> => new Promise((resolve, reject) => {
  const file = fs.createWriteStream(filePath);
  https.get(imageUrl, (response) => {
    response.pipe(file);

    file.on('finish', () => {
      file.close();
      resolve(true);
    });

    file.on('error', err => reject(err));
  }).on('error', err => reject(err));
});

const setOSWallpaper = async (context: vscode.ExtensionContext, filePath: string) => {
  try {
    if (platform === 'darwin') {
      const binary = path.join(context.globalStorageUri.fsPath, 'macos-wallpaper');
      await macos.setWallpaper(binary, filePath);
    } else if (platform === 'win32') {
      const binary = path.join(context.globalStorageUri.fsPath, 'windows-wallpaper.exe');
      await windows.setWallpaper(binary, filePath);
    } else {
      await wallpaper.setWallpaper(filePath);
    }
    vscode.window.showInformationMessage('Succeeded.');
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage('Failed to set wallpaper. 设置壁纸失败');
  }
};


export const downloadMacOSTool = async (context: vscode.ExtensionContext) => {
  if (platform !== 'darwin') {
    return;
  }
  const filePath = path.join(context.globalStorageUri.fsPath, 'macos-wallpaper');
  await downloadFile('https://github.com/IceEnd/Yosoro-Img/releases/download/0.0.1/macos-wallpaper', filePath);
  fs.chmodSync(filePath, 0o777);
};

export const downloadWindowsTool = (context: vscode.ExtensionContext) => {
  if (platform !== 'win32') {
    return;
  }
  const filePath = path.join(context.globalStorageUri.fsPath, 'windows-wallpaper.exe');
  downloadFile('https://github.com/sindresorhus/win-wallpaper/releases/download/v1.1.2/wallpaper.exe', filePath);
};

const downloadFile = async (url: string, filePath: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    https.get(url, async (response) => {
      if (response.statusCode === 302) {
        try {
          await downloadFile(response.headers.location as string, filePath);
          resolve(true);
          return;
        } catch (error) {
          reject(error);
        }
      }
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        showDownloadMessage(true);
        resolve(true);
      });
      file.on('error', err => {
        reject(err);
        showDownloadMessage(false, err);
      });
    }).on('error', err => {
      reject(err);
      showDownloadMessage(false, err);
    });
  });
};

export const preDownload = (context: vscode.ExtensionContext) => {
  const dir = context.globalStorageUri.fsPath;
  if (fs.existsSync(dir)) {
    return;
  }
  fs.mkdirSync(dir);
};

const showDownloadMessage = (success: boolean, err?: unknown) => {
  if (success) {
    vscode.window.showInformationMessage('Install Succeed. 安装成功');
    return;
  }
  vscode.window.showErrorMessage('Install failed. 安装失败');
  console.error(err);
};
