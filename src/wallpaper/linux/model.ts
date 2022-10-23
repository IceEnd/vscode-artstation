export interface IManager {
  isAvailable: () => Promise<boolean>,
  set: (image: string) => Promise<void>;
}