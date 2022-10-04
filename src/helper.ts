import * as vscode from 'vscode';
import * as path from 'path';

export const getSourcePath = (context: vscode.ExtensionContext, relativePath: string): vscode.Uri => {
  const absPath = path.join(context.extensionPath, relativePath);
  const disk = vscode.Uri.file(absPath);

  return disk.with({ scheme: 'vscode-resource' });
};

export const getLoadingPage = (context: vscode.ExtensionContext): string => {
  const html = getLoadingHtml(context);
  return getHtml(context, html);
};

export const getLoadingHtml = (context: vscode.ExtensionContext): string => {
  const imgPath = getSourcePath(context, 'logo.svg');
  const html = `
    <div class="loading-container">
      <div class="loading">
          <img class="loading-img" src="${imgPath}" alt="loading">
          <h1>Loading...</h1>
      </div>
    </div>
  `;
  return html;
};

export const getHtml = (
  context: vscode.ExtensionContext,
  html: string,
  artstation = false,
): string => {
  const cssPath = getSourcePath(context, 'template/styles.css');
  const artstationJS = getSourcePath(context, 'template/artstation.js');
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Artstation</title>
      <link rel="stylesheet" href="${cssPath}" media="screen" />
  </head>
  <body>
    ${html}
    ${artstation ? `<script src="${artstationJS}"></script>` : ''}
  </body>
  </html>
  `;
};

export const randomString = (length = 32): string => {
  const token = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  let res = '';
  for (let i = 0; i < length; i++) {
    res += token.charAt(Math.floor(Math.random() * token.length))
  };
  return res;
};
