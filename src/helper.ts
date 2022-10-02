import * as vscode from 'vscode';
import * as path from 'path';

export const getSourcePath = (context: vscode.ExtensionContext, relativePath: string): vscode.Uri => {
  const absPath = path.join(context.extensionPath, relativePath);
  const disk = vscode.Uri.file(absPath);

  return disk.with({ scheme: 'vscode-resource' });
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
  return getHtml(context, html);
};

export const getHtml = (
  context: vscode.ExtensionContext,
  html: string,
  artstation = false,
): string => {
  const cssPath = getSourcePath(context, 'src/template/styles.css');
  const artstationJS = getSourcePath(context, 'src/template/artstation.js');
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
