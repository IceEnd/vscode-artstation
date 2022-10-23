import axios, { AxiosResponse } from 'axios';
import * as vscode from 'vscode';
import { channelType, IListResponse, IProject } from './model';
import { getCookie } from '../helper';

// page size
const PER_SIZE = 60;

let token = '';

const instance = axios.create({
  baseURL: 'https://www.artstation.com/',
  timeout: 10000,
});

const interceptorRejected = (error: AxiosResponse) => {
  console.error(error);
  if (!(error.config as { silence: boolean }).silence) {
    vscode.window.showErrorMessage('Artstation: Request failed.');
  }
  return Promise.reject(error);
};

const interceptorFulfilled = (response: AxiosResponse) => {
  if (![200, 204].includes(response.status)) {
    vscode.window.showErrorMessage(`Artstation: ${response.data}`);
    return;
  }
  return response.data;
};

instance.interceptors.response.use(interceptorFulfilled, interceptorRejected);

export const setCookie = (cookie: string) => {
  if (!cookie) {
    return;
  }
  instance.defaults.headers.common['cookie'] = cookie;
};

export const setToken = async () => {
  const res = await fetchToken();
  token = res;
};

export const fetchToken = (): Promise<string> => {
  const url = 'api/v2/csrf_protection/token';
  return instance.get(url, {
    // @ts-ignore
    silence: true,
  });
};

export const fetchList = (
  type = channelType.community,
  page = 1,
): Promise<IListResponse> => {
  const url = `api/v2/community/explore/projects/${type}.json`;
  return instance.get(url, {
    params: {
      page,
      per_page: PER_SIZE,
      dimension: 'all',
    },
  });
};

export const fetchProject = (hashID: string): Promise<IProject> => {
  const url = `projects/${hashID}.json`;
  return instance.get(url);
};

const getSessionHeader = () => ({
  'public-csrf-token': token,
  artstationsessionheader: encodeURIComponent(
    getCookie(
      instance.defaults.headers.common['cookie'] as string,
      'ArtStationSessionCookie',
    ),
  ),
});

export const fetchFollowing = (
  userID: string,
  channel: string,
  followed: boolean,
): Promise<unknown> => {
  const url = 'followings.json';
  const headers = getSessionHeader();
  if (!followed) {
    return instance.post(url, new URLSearchParams({
      followee_id: userID,
      channel: `channel_${channel}`,
    }), {
      headers,
    });
  }
  return instance.delete(url, {
    params: {
      followee_id: String(userID),
    },
    headers,
  });
};

export const fetchVotes = (id: string, liked: boolean) => {
  const url = 'votes.json';
  const headers = getSessionHeader();

  if (!liked) {
    return instance.post(url, new URLSearchParams({
      type: 'like',
      votable_id: id,
      votable_type: 'Project',
    }), {
      headers,
    });
  }
  return instance.delete(url, {
    params: {
      type: 'like',
      votable_type: 'Project',
      votable_id: id,
    },
    headers,
  });
};
