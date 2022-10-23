import { commandExists, execFile, hasLine } from '../util';

export const isAvailable = async () => {
  if (!await commandExists('gsettings')) {
    return false;
  }

  try {
    const {stdout} = await execFile('gsettings', ['list-schemas']);
    return hasLine(stdout, 'org.mate.background');
  } catch {
    return false;
  }
};

export const set = async (imagePath: string) => {
  await execFile('gsettings', [
    'set',
    'org.mate.background',
    'picture-filename',
    imagePath,
  ]);
};
