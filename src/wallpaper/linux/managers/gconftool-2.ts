import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('gconftool-2');


export const set = async (imagePath: string) => {
  await execFile('gconftool-2', [
    '--set',
    '/desktop/gnome/background/picture_filename',
    '--type',
    'string',
    imagePath,
  ]);
};
