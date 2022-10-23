import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('feh');

export const set = async (imagePath: string) => {
  await execFile('feh', ['--bg-fill', imagePath]);
};
