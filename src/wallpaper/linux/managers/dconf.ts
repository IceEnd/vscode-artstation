import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('dconf');

export const set = async (imagePath: string) => {
  await execFile('dconf', [
    'write',
    '/org/mate/desktop/background/picture-filename',
    `"${imagePath}"`,
  ]);
};
