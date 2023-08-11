import { userInstance } from '~/api/User';
import { BASE_URL } from '../constants/api';

import type { Oauth } from '~/@types/oauth.types';
import { apiClient } from '~/api';

const getAccessToken = async (type: Oauth, code: string) => {
  const response = await apiClient.get(`${BASE_URL}/api/oauth/login/${type}?code=${code}`);
  return response.data;
};

export const getLogout = async (type: Oauth) => {
  const response = await userInstance.get(`${BASE_URL}/api/oauth/logout/${type}`);

  return response.data;
};

export default getAccessToken;
