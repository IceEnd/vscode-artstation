import * as vscode from 'vscode';
import { setCookie, fetchList, fetchProject } from './api';
import {
  channelType,
  IImageInfo,
  IIconInfo,
  IMessage,
  IProject,
} from './model';
import { getHtml, getLoadingPage, getLoadingHtml } from '../helper';
import { SyncKeys } from '../constants';

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
    }
  );

  panel.webview.html = getLoadingPage(context);

  const cookie = context.globalState.get(SyncKeys.cookie) || '';
  setCookie(cookie as string);

  fetchList(state.channel, state.page)
    .then((res) => {
      panel.webview.html = getContentHtml(context, res.data);
    });

  panel.webview.onDidReceiveMessage((message: IMessage) => {
    handleLoadMore(panel, message);
    handleChannel(panel, message);
    handleProject(panel, message);
  }, undefined, context.subscriptions);
};

const handleLoadMore = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'load-more') {
    return;
  }
  state.page += 1;
  const res = await fetchList(state.channel, state.page);
  panel.webview.postMessage({
    command: message.command,
    payload: {
      channel: message.payload as string,
      html: getListHtml(res.data),
    },
  });
};

const handleChannel = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'channel') {
    return;
  }
  state.page = 1;
  state.channel = message.payload as channelType;
  const res = await fetchList(state.channel, state.page);
  panel.webview.postMessage({
    command: message.command,
    payload: {
      channel: message.payload as string,
      html: getListHtml(res.data),
    },
  });
};

const handleProject = async (panel: vscode.WebviewPanel, message: IMessage) => {
  if (message.command !== 'project') {
    return;
  }
  const res = await fetchProject(message.payload as string);
  panel.webview.postMessage({
    command: message.command,
    payload: {
      hashID: message.payload as string,
      html: getProjectHtml(res),
    },
  });
};

const getContentHtml = (context: vscode.ExtensionContext, data: IImageInfo[]): string => {
  const tool = getToolHtml();
  const list = `<div class="gallery-grid artstation" id="gallery-grid-artstation">${getListHtml(data)}</div>`;
  const content = `
    <div class="artstation">
    ${tool}${list}
    <div class="loading-wrapper">loading...</div>
    <div class="project-overlay">
      ${getLoadingHtml(context)}
      <div class="project-overlay-content"></div>
    </div>
    </div>
  `;
  return getHtml(context, content, true);
};

const getToolHtml = (): string => `
<div class="channels-sorting-wrap artstation">
  <ul class="channels-sorting">
    <li class="channels-sorting-item active" data-channel="community">
      <span>Community</span>
    </li>
    <li class="channels-sorting-item" data-channel="trending">
      <span>Trending</span>
    </li>
    <li class="channels-sorting-item" data-channel="latest">
      <span>Latest</span>
    </li>
    <li class="channels-sorting-item" data-channel="following">
      <span>Following</span>
    </li>
  </ul>
</div>
`;

const getListHtml = (data: IImageInfo[]): string => {
  const html = data.reduce((acc, image: IImageInfo) => {
    const content = `
      <div class="gallery-grid-item" hash-id="${image.hash_id}">
        ${getIcons(image.icons)}
        <div class="gallery-grid-overlay d-none d-md-block">
          <div class="gallery-grid-info">
            <img class="flex-shrink-0 img-circle" height="26" width="26" src="${image.user.medium_avatar_url}" alt="${image.user.full_name}">
            <div class="gallery-grid-info-inner">
              <div class="gallery-grid-title">${image.title}</div>
              <div class="gallery-grid-name">
                <span>${image.user.full_name}</span>
                ${image.user.pro_member
                  ? '<div class="pro-badge ng-star-inserted">Pro</div>'
                  : ''
                }
              </div>
            </div>
          </div>
        </div>
        <img class="d-block" width="100%" src="${image.smaller_square_cover_url}" alt="${image.title}">
      </div>
    `;
    return acc + content;
  }, '');
  return html;
};

const getIcons = (icons: IIconInfo): string => `
<ul class="gallery-grid-icons">
  ${icons.multiple_images ? '<li class="gallery-grid-icons-item fa-images"></li>' : ''}
</ul>
`;

const getProjectHtml = (project: IProject): string => {
  console.log(project);
  return '';
};
