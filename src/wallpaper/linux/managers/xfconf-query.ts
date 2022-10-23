import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('xfconf-query');

export const set = async (imagePath: string) => {
  await execFile('xfconf-query', [
    '--channel',
    'xfce4-desktop',
    '--property',
    '/backdrop/screen0/monitor0/image-path',
    '--set',
    `${imagePath}`,
  ]);
};
