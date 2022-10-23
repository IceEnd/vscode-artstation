import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('qdbus');

export const set = async (imagePath: string) => {
  await execFile('qdbus', [
    'org.kde.plasmashell',
    '/PlasmaShell',
    'org.kde.PlasmaShell.evaluateScript',
    `
    var allDesktops = desktops();
    for (var i = 0; i < allDesktops.length; i++) {
      var desktop = allDesktops[i];
      desktop.wallpaperPlugin = 'org.kde.image';
      desktop.currentConfigGroup = ['Wallpaper', 'org.kde.image', 'General'];
      desktop.writeConfig('Image', 'file://${imagePath}');
    }
    `,
  ]);
};
