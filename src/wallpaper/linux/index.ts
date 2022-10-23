import * as path from 'path';
import * as managers from './managers/index';
import { IManager } from './model';

let availableApps: IManager[];

export const setAvailableApps = async () => {
  availableApps = [];

  const promises = Object.values(managers).map(async manager => {
    if (await manager.isAvailable()) {
      availableApps.push(manager as IManager);
    }
  });

  await Promise.all(promises);
};

export const setWallpaper = async (imagePath: string) => {
  if (typeof imagePath !== 'string') {
    throw new TypeError('Expected a string');
  }

  if (!availableApps) {
    await setAvailableApps();
    await setWallpaper(imagePath);
    return;
  }

  const promises = availableApps.map(async app => {
    if (typeof app.set === 'function') {
      await app.set(path.resolve(imagePath));
    }
  });

  await Promise.allSettled(promises);
};
