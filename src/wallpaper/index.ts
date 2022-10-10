import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as wallpaper from 'wallpaper';
import * as macos from './macos';
import * as windows from './windows';
import { downloadFile, validWallpaperPath, getWallpaperPath } from '../helper';

const platform = os.platform();

/**
 * Set OS wallpaper
 * @param image picture url
 */
export const setWallpaper = async (context: vscode.ExtensionContext, image: string): Promise<void> => {
  const valid = validWallpaperPath();
  if (!valid) {
    return;
  }
  const filePath = getWallpaperPath(image);
  let saveFlag = false;
  try {
    saveFlag = await downloadFile(image, filePath);
  } catch (err) {
    console.error(err);
    vscode.window.showErrorMessage('Download wallpaper failed. 下载壁纸失败');
  }
  saveFlag && setOSWallpaper(context, filePath);
};

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
  try {
    await downloadFile('https://github.com/IceEnd/Yosoro-Img/releases/download/0.0.1/macos-wallpaper', filePath);
    showDownloadMessage(true);
  } catch (error) {
    showDownloadMessage(false, error);
  }
  fs.chmodSync(filePath, 0o777);
};

export const downloadWindowsTool = async (context: vscode.ExtensionContext) => {
  if (platform !== 'win32') {
    return;
  }
  const filePath = path.join(context.globalStorageUri.fsPath, 'windows-wallpaper.exe');
  try {
    await downloadFile('https://github.com/sindresorhus/win-wallpaper/releases/download/v1.1.2/wallpaper.exe', filePath);
    showDownloadMessage(true);
  } catch (error) {
    showDownloadMessage(false, error);
  }
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
