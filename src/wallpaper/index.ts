import * as vscode from 'vscode';
import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { setWallpaper } from 'wallpaper';
import { randomString } from '../helper';

/**
 * Set OS wappler
 * @param image picture url
 */
export const setWappler = async (image: string): Promise<void> => {
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
  saveFlag && setOSWallpaper(filePath);
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

const setOSWallpaper = async (filePath: string) => {
  try {
    await setWallpaper(filePath);
    vscode.window.showInformationMessage('Succeeded.');
  } catch (error) {
    console.error(error);
    vscode.window.showErrorMessage('Failed to set wallpaper. 设置壁纸失败');
  }
};
