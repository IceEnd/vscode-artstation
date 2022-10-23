import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('dcop');

export const set = async (imagePath: string) => {
  await execFile('dcop', [
    'kdesktop',
    'KBackgroundIface',
    'setWallpaper',
    `${imagePath} 1`,
  ]);
};
