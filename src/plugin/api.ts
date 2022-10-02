import axios, { AxiosResponse } from 'axios';
import * as vscode from 'vscode';
import { channelType, IListResponse } from './model';

const instance = axios.create({
  baseURL: 'https://www.artstation.com/api/v2/community/explore/projects/',
  timeout: 10000,
});

const interceptorRejected = (error: AxiosResponse) => {
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

// page size
const PER_SIZE = 60;

export const setCookie = (cookie: string) => {
  if (!cookie) {
    return;
  }
  instance.defaults.headers.common['cookie'] = cookie;
};

export const fetchList = (
  type = channelType.community,
  page = 1,
): Promise<IListResponse> => {
  const url = `${type}.json`;
  console.log(`https://www.artstation.com/api/v2/community/explore/projects/${url}`);
  return instance.get(url, {
    params: {
      page,
      per_page: PER_SIZE,
      dimension: 'all',
    },
  });
};
