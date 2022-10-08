import * as vscode from 'vscode';
import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as apis from './api';
import * as render from './render';
import { channelType, IMessage } from './model';
import { setWallpaper } from '../wallpaper';
import { getLoadingPage } from '../helper';
import { SyncKeys } from '../constants';

dayjs.extend(relativeTime);

const state = {
  page: 1,
  channel: channelType.community,
};

export const artstation = (context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    'Artstation',
    'Artstation',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
    }
  );

  panel.webview.html = getLoadingPage(context);

  const cookie = context.globalState.get(SyncKeys.cookie) || '';
  apis.setCookie(cookie as string);

  apis.fetchList(state.channel, state.page)
    .then((res) => {
      panel.webview.html = render.renderContent(context, res.data);
    });

  panel.webview.onDidReceiveMessage((message: IMessage) => {
    handleLoadMore(panel, message);
    handleChannel(panel, message);
    handleProject(panel, message);
    handleFollowing(panel, message);
    handleSetWallpaper(context, message);
  }, undefined, context.subscriptions);
};

const handleLoadMore = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'load-more') {
    return;
  }
  state.page += 1;
  const res = await apis.fetchList(state.channel, state.page);
  panel.webview.postMessage({
    command: message.command,
    payload: {
      channel: message.payload as string,
      html: render.renderProjects(res.data),
    },
  });
};

const handleChannel = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'channel') {
    return;
  }
  state.page = 1;
  state.channel = message.payload as channelType;
  const res = await apis.fetchList(state.channel, state.page);
  panel.webview.postMessage({
    command: message.command,
    payload: {
      channel: message.payload as string,
      html: render.renderProjects(res.data),
    },
  });
};

const handleProject = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'project') {
    return;
  }
  const res = await apis.fetchProject(message.payload as string);
  panel.webview.postMessage({
    command: message.command,
    payload: {
      hashID: message.payload as string,
      html: render.renderProjectView(res),
    },
  });
};

const handleFollowing = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'following') {
    return;
  }
  type IPayload = {
    id: string,
    followed: boolean,
    hashID: string,
  };
  const payload = {
    success: true,
    hashID: (message.payload as IPayload).hashID,
    followed: (message.payload as IPayload).followed,
  };
  try {
    interface IPayload {
      id: string,
      followed: boolean,
      hashID: string,
    }
    await apis.fetchFollowing(
      (message.payload as IPayload).id,
      state.channel,
      (message.payload as IPayload).followed,
    );
    payload.followed = !payload.followed;
  } catch (error) {
    payload.success = false;
  }
  panel.webview.postMessage({
    command: message.command,
    payload,
  });
};

const handleSetWallpaper = async (context: vscode.ExtensionContext, message: IMessage) => {
  if (message.command !== 'wallpaper') {
    return;
  }
  interface IPayload {
    url: string,
    for: string,
  }
  const answer = await vscode.window.showInformationMessage(
    'Do you want to set it as the system wallpaper? 要设置成系统壁纸吗？',
    'Yes', 'No',
  );
  if (answer !== 'Yes') {
    return;
  }
  setWallpaper(context, (message.payload as IPayload).url);
};
