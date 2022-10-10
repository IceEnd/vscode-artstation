import * as vscode from 'vscode';
import * as os from 'os';
import * as dayjs from 'dayjs';
import {
  IImageInfo,
  IIconInfo,
  IProject,
  IAsset,
  assetType,
  IUserInfo,
} from './model';
import { getHtml, getLoadingHtml } from '../helper';

export const renderContent = (context: vscode.ExtensionContext, data: IImageInfo[]): string => {
  const tool = renderChannel();
  const list = `<div class="gallery-grid artstation" id="gallery-grid-artstation">${renderProjects(data)}</div>`;
  const content = `
    <div class="artstation">
    ${tool}${list}
    <div class="loading-wrapper">loading...</div>
    <div class="project-overlay">
      ${getLoadingHtml(context)}
      <div class="project-overlay-content"></div>
      <span class="far fa-times close"></span>
    </div>
    </div>
  `;
  return getHtml(context, content, true);
};

export const renderChannel = (): string => `
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

export const renderProjects = (data: IImageInfo[]): string => {
  const html = data.reduce((acc, image: IImageInfo) => {
    const content = `
      <div class="gallery-grid-item" hash-id="${image.hash_id}">
        ${renderProjectIcons(image.icons)}
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

export const renderProjectIcons = (icons: IIconInfo): string => `
<ul class="gallery-grid-icons">
  ${icons.multiple_images ? '<li class="gallery-grid-icons-item"><span class="far fa-images"></span></li>' : ''}
  ${icons.video || icons.video_clip
    ? '<li class="gallery-grid-icons-item"><span class="far fa-video"></span></li>'
    : ''
  }
</ul>
`;

export const renderProjectView = (project: IProject): string => `
<div class="project-view d-lg-flex">
  <main class="project-assets">
    ${renderAssets(project.assets)}
  </main>
  <aside class="project-sidebar">
    ${renderAuthor(project.user)}
    ${renderUserAction(project)}
    ${renderProjectInfo(project)}
    ${renderProjectMeta(project)}
  </aside>
</div>
`;

export const renderAssets = (assets: IAsset[]): string => {
  const html = assets.reduce((content, item: IAsset) => {
    content += renderImage(item);
    content += renderVideo(item);
    content += renderVideoClip(item);
    return content;
  }, '');
  return html;
};

export const renderImage = (asset: IAsset): string => {
  if (asset.asset_type !== assetType.image) {
    return '';
  }
  return `
    <div class="asset asset-image">
      <img class="img-fit block-center img-responsive" src="${asset.image_url}">
      ${renderAssetActions(asset.image_url)}
    </div>
  `;
};

export const renderAssetActions = (url: string): string => {
  if (vscode.env.uiKind !== vscode.UIKind.Desktop) {
    return '';
  }
  const platform = os.platform();
  if (!['darwin', 'win32', 'linux'].includes(platform)) {
    return '';
  }
  return `
  <div class="asset-actions">
    <i class="btn asset-actions-btn-download far fa-arrow-to-bottom" data-url="${url}"></i>
    <i class="btn asset-actions-btn-bg far fa-cog" data-url="${url}" data-for="desktop"></i>
  </div>
`;
};

export const renderVideo = (asset: IAsset): string => {
  if (asset.asset_type !== assetType.video
    || !asset.has_embedded_player) {
    return '';
  }
  return `
    <div class="asset asset-embedded">
      ${asset.player_embedded}
    </div>
  `;
};

export const renderVideoClip = (asset: IAsset): string => {
  if (asset.asset_type !== assetType.video_clip
    || !asset.has_embedded_player) {
    return '';
  }
  return `
    <div class="asset video-clip">
      ${asset.player_embedded}
    </div>
  `;
};

export const renderAuthor = (author: IUserInfo): string => `
<div class="project-author-container">
  <div class="project-user-avatar">
    <img class="img-circle" src="${author.medium_avatar_url}" alt="${author.username}">
  </div>
  <div class="project-author">
    <h2 class="project-author-name">${author.username}</h2>
    <h3 class="project-author-headline">${author.headline || ''}</h3>
    <div class="follow-button">
      <button
        class="btn-following ${author.followed ? 'followed' : ''}"
        type="button"
        onclick="artstationFollow(${author.id})"
      >
        <span class="has-followed">
          <i class="far fa-check fa-pad-right"></i>Following
        </span>
        <span class="not-followed">
          <i class="far fa-user-plus fa-pad-right"></i>Follow
        </span>
      </button>
    </div>
  </div>
</div>
`;

export const renderUserAction = (project: IProject): string => `
<div class="project-actions-user row">
  <div class="col-xs-6">
    <button
      class="btn-like btn-block ${project.liked ? '' : 'btn-success'}"
      onclick="artstationVotes(${project.id})"
    >
      <span class="liked-txt">
        <i class="far fa-check fa-pad-right"></i>Liked
      </span>
      <span class="thumbs-up-txt">
        <i class="far fa-thumbs-up fa-pad-right"></i>Like
      </span>
    </button>
  </div>
  <div class="col-xs-6"></div>
</div>
`;

export const renderProjectInfo = (project: IProject): string => `
<div class="project-info">
  <h1 class="project-info-title">${project.title}</h1>
  <div class="project-info-description">${project.description_html}</div>
  <div class="project-info-published">
    Posted ${dayjs(project.published_at).fromNow()}
  </div>
</div>
`;

export const renderProjectMeta = (project: IProject): string => `
<div class="project-meta d-flex justify-content-between">
  <div class="likes">
    <i class="far fa-thumbs-up fa-pad-right"></i>
    ${project.likes_count} Likes
  </div>
  <div class="views">
    <i class="far fa-eye fa-pad-right"></i>
    ${project.views_count} Views
  </div>
  <div class="comments">
    <i class="far fa-comments fa-pad-right"></i>
    ${project.comments_count} Comments
  </div>
</div>
`;
