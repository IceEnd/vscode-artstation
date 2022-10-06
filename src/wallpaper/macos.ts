import { promisify } from 'node:util';
import * as childProcess from 'node:child_process';
import * as path from 'node:path';

const execFile = promisify(childProcess.execFile);

export const setWallpaper = async (
  binary: string,
  imagePath: string,
  {screen = 'all', scale = 'auto'} = {}
) => {
  if (typeof imagePath !== 'string') {
    throw new TypeError('Expected a string');
  }

  const arguments_ = [
    'set',
    path.resolve(imagePath),
    '--screen',
    screen,
    '--scale',
    scale,
  ];

  await execFile(binary, arguments_);
};
