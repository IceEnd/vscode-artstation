import {commandExists, execFile, readFile} from '../util';

export const isAvailable = () => commandExists('nitrogen');;

export const set = async (imagePath: string) => {
  await execFile('nitrogen', [
    '--set-zoom-fill',
    '--save',
    imagePath,
  ]);
};
