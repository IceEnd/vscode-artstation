import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('pcmanfm');

export const set = async (imagePath: string) => {
  await execFile('pcmanfm', ['--set-wallpaper', imagePath]);
};
