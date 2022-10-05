import * as vscode from 'vscode';
import { SyncKeys } from './constants';
import * as command from './plugin/command';

export const activate = (context: vscode.ExtensionContext): void => {
  context.globalState.setKeysForSync([SyncKeys.cookie]);

  command.activate(context);
};
