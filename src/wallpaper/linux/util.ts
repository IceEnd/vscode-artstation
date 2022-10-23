import * as util from 'node:util';
import * as childProcess from 'child_process';
import * as fs from 'fs';

export const execFile = util.promisify(childProcess.execFile);
export const exec = util.promisify(childProcess.exec);

export const commandExists = async (command: string) => {
  // `which` all commands and expect stdout to return a positive
  try {
    let {stdout} = await execFile('which', ['-a', command]);
    stdout = stdout.trim();

    if (!stdout) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

export const hasLine = (str: string, lineToFind: string) => {
  return str.split('\n').find(line => line.trim() === lineToFind);
};

export const readFile = fs.promises;
