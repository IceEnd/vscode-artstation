import { commandExists, execFile } from '../util';

export const isAvailable = () => commandExists('gsettings');

export const set = async (imagePath: string) => {
  await execFile('gsettings', [
    'set',
    'org.gnome.desktop.background',
    'picture-uri',
    `file://${imagePath}`,
  ]);
};
