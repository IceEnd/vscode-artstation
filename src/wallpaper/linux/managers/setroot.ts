import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('setroot');

export const set = async (imagePath: string) => {
  await execFile('setroot', [imagePath]);
};
