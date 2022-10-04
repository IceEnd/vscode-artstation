import * as vscode from 'vscode';
import { SyncKeys } from './constants';
import * as command from './plugin/command';

export const activate = (context: vscode.ExtensionContext): void => {
  context.globalState.setKeysForSync([SyncKeys.cookie]);

  console.log(context.globalStorageUri, 223333);

  command.activate(context);
};
