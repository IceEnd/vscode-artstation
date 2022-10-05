import * as vscode from 'vscode';
import * as fs from 'fs';
import { artstation } from './artstation';
import * as apis from './api';
import * as wallpaper from '../wallpaper';
import { removeDir } from '../helper';
import { SyncKeys } from '../constants';

export const activate = (context: vscode.ExtensionContext): void => {
  registerCommand(context);
};

const registerCommand = (context: vscode.ExtensionContext): void => {
  loginCommand(context);
  startCommand(context);
  installCommand(context);
  uninstallCommand(context);
};

/**
 * Login with cookies
 */
const loginCommand = async (context: vscode.ExtensionContext): Promise<void> => {
  const disposable = vscode.commands.registerCommand('artstation.login', async () => {
    const cookie = await vscode.window.showInputBox({
      title: 'Artstation Cookie',
      placeHolder: 'Please enter cookie.',
    });
    if (!cookie) {
      return;
    }
    context.globalState.update(SyncKeys.cookie, cookie);
    apis.setCookie(cookie);
    await apis.fetchToken();
    vscode.window.showInformationMessage('Succeed.');
  });
  context.subscriptions.push(disposable);
};

const startCommand = (context: vscode.ExtensionContext): void => {
  const disposable = vscode.commands.registerCommand('artstation.start', () => {
    artstation(context);
  });
  context.subscriptions.push(disposable);
};

const installCommand = (context: vscode.ExtensionContext): void => {
  const disposable = vscode.commands.registerCommand('artstation.install', () => {
    wallpaper.preDownload(context);
    wallpaper.downloadMacOSTool(context);
    wallpaper.downloadWindowsTool(context);
  });
  context.subscriptions.push(disposable);
};

const uninstallCommand = (context: vscode.ExtensionContext): void => {
  const disposable = vscode.commands.registerCommand('artstation.uninstall', () => {
    removeDir(context.globalStorageUri.fsPath);
    vscode.window.showInformationMessage('Uninstall succeed. 卸载成功');
  });
  context.subscriptions.push(disposable);
};
