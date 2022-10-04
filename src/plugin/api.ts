import axios, { AxiosResponse } from 'axios';
import * as vscode from 'vscode';
import { channelType, IListResponse, IProject, IToken } from './model';

// page size
const PER_SIZE = 60;

let token = '';

const instance = axios.create({
  baseURL: 'https://www.artstation.com/',
  timeout: 10000,
});

const interceptorRejected = (error: AxiosResponse) => {
  console.error(error);
  vscode.window.showErrorMessage('Artstation: Request failed.');
  return Promise.reject(error);
};

const interceptorFulfilled = (response: AxiosResponse) => {
  if (response.status !== 200) {
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
  token = res.token;
  console.log(token);
};

export const fetchToken = (): Promise<IToken> => {
  const url = 'api/v2/websockets_auth/login.json';
  return instance.post(url, {});
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

// todo: CSRF
export const fetchFollowing = (
  userID: string,
  channel: string,
  followed: boolean,
): Promise<unknown> => {
  const url = 'followings.json';
  const headers = {
    'x-csrf-token': token,
  };
  if (!followed) {
    return instance.post(url, {
      channel: `channel_${channel}`,
      followee_id: String(userID),
    }, {
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
