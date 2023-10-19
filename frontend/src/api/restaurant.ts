import { getRestaurantQueryString } from '~/utils/getQueryString';
import { apiClient, apiUserClient } from './apiClient';
import type { RestaurantListData } from '~/@types/api.types';
import type { RestaurantsQueryParams } from '~/@types/restaurant.types';

export const getRestaurants = async (queryParams: RestaurantsQueryParams) => {
  if (queryParams.boundary) {
    const queryString = getRestaurantQueryString(queryParams);
    const response = await apiUserClient.get<RestaurantListData>(`/restaurants?${queryString}`);

    return response.data;
  }
  return null;
};

export const getRestaurantDetail = async (restaurantId: string, celebId: string) => {
  const response = await apiUserClient.get(`/restaurants/${restaurantId}?celebId=${celebId}`);
  return response.data;
};

export const getNearByRestaurant = async (restaurantId: string) => {
  const response = await apiUserClient.get(`/restaurants/${restaurantId}/nearby`);
  return response.data;
};

export const getRestaurantVideo = async (restaurantId: string) => {
  const response = await apiClient.get(`/videos?restaurantId=${restaurantId}`);
  return response.data;
};

export const getRestaurantsByAddress = async ({ codes, page }: { codes: number[]; page: number }) => {
  const response = await apiUserClient.get(`/main-page/region?codes=${codes.join(',')}&page=${page}`);
  return response.data;
};

export const getUpdatedRestaurants = async () => {
  const response = await apiUserClient.get('/main-page/latest');
  return response.data;
};

export const getRecommendedRestaurants = async () => {
  const response = await apiUserClient.get('/main-page/recommendation');
  return response.data;
};

export const postRevisedInfo = async ({
  restaurantId,
  data,
}: {
  restaurantId: number;
  data: { contents: string[] };
}) => {
  const response = await apiClient.post(`/restaurants/${restaurantId}/correction`, data);
  return response.data;
};
