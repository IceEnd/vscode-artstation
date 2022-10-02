import * as vscode from 'vscode';
import { artstation } from './artstation';
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
const loginCommand = (context: vscode.ExtensionContext): void => {
  const disposable = vscode.commands.registerCommand('artstation.artstationLogin', async () => {
    const cookie = await vscode.window.showInputBox({
      title: 'Artstation Cookie',
      placeHolder: 'Please enter cookie.',
    });
    cookie && context.globalState.update(SyncKeys.cookie, cookie);
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
