export interface IListResponse {
  data: IImageInfo[],
}

export interface IImageInfo {
  id: number,
  hash_id: string,
  hide_as_adult: boolean,
  smaller_square_cover_url: string,
  title: string,
  url: string,
  icons: IIconInfo,
  user: IUserInfo,
}

export interface IUserInfo {
  full_name: string,
  id: number,
  is_plus_member: boolean,
  is_school_account: boolean,
  is_staff: boolean,
  is_studio_account: boolean,
  medium_avatar_url: string,
  pro_member: boolean,
  username: string,
}

export interface IIconInfo {
  image: boolean,
  marmoset: boolean,
  model3d: boolean,
  multiple_images: boolean,
  pano: boolean,
  video: boolean,
  video_clip: boolean,
}

export interface IMessage {
  command: string,
  payload: unknown,
}

export enum channelType {
  community = 'community',
  trending = 'trending',
  latest = 'latest',
  following = 'following',
}
