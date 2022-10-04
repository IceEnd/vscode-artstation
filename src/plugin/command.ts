import * as vscode from 'vscode';
import { artstation } from './artstation';
import * as apis from './api';
import { SyncKeys } from '../constants';

export const activate = (context: vscode.ExtensionContext): void => {
  registerCommand(context);
};

const registerCommand = (context: vscode.ExtensionContext): void => {
  loginCommand(context);
  startCommand(context);
};

/**
 * Login with cookies
 */
const loginCommand = async (context: vscode.ExtensionContext): Promise<void> => {
  const disposable = vscode.commands.registerCommand('artstation.artstationLogin', async () => {
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
  const disposable = vscode.commands.registerCommand('artstation.artstation', () => {
    artstation(context);
  });
  context.subscriptions.push(disposable);
};
