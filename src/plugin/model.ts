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

export interface IProject {
  admin_adult_content: boolean,
  adult_content: boolean,
  categories: unknown[],
  collections: unknown[],
  comments_count: number,
  cover_url: string,
  created_at: string,
  description: string,
  description_html: string,
  editor_pick: boolean,
  hash_id: string,
  hide_as_adult: boolean,
  id: number,
  liked: boolean,
  likes_count: number,
  medium?: unknown,
  mediums: unknown[],
  permalink: string,
  published_at: string,
  slug: string,
  software_items: unknown[],
  suppressed: boolean,
  tags: string[],
  title: string,
  updated_at: string,
  user: IUserInfo,
  user_id: number,
  views_count: number,
  visible: boolean,
  visible_on_artstation: boolean,
  assets: IAsset[],
}

export interface IAsset {
  asset_type: assetType,
  has_embedded_player: boolean,
  has_image: boolean,
  height: number,
  width: number,
  id: number,
  image_url: string,
  oembed: unknown,
  player_embedded: unknown,
  position: number,
  title: string,
  title_formatted: string,
  viewport_constraint_type: string,
}

export interface IUserInfo {
  full_name: string,
  id: number,
  is_plus_member: boolean,
  is_school_account: boolean,
  is_staff: boolean,
  is_studio_account: boolean,
  medium_avatar_url: string,
  large_avatar_url: string,
  headline: string,
  pro_member: boolean,
  username: string,
  blocked: boolean,
  followed: boolean,
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

export enum assetType {
  cover = 'cover',
  video_clip = 'video_clip',
  image = 'image',
  video = 'video',
}
