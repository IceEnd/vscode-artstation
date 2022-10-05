
import { promisify } from 'node:util';
import * as childProcess from 'node:child_process';
import * as path from 'node:path';

const execFile = promisify(childProcess.execFile);

export const setWallpaper = async (binary: string, imagePath: string): Promise<void> => {
  if (typeof imagePath !== 'string') {
    throw new TypeError('Expected a string');
  }

  await execFile(binary, [path.resolve(imagePath)]);
};
