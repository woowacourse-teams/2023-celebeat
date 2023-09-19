import getQueryString from '~/utils/getQueryString';
import { apiClient } from './apiClient';
import type { RestaurantListData } from '~/@types/api.types';
import type { RestaurantsQueryParams } from '~/@types/restaurant.types';

export const getRestaurants = async (queryParams: RestaurantsQueryParams) => {
  const queryString = getQueryString(queryParams);
  const response = await apiClient.get<RestaurantListData>(`/restaurants?${queryString}`);

  return response.data;
};

export const getRestaurantDetail = async (restaurantId: string, celebId: string) => {
  const response = await apiClient.get(`/restaurants/${restaurantId}?celebId=${celebId}`);
  return response.data;
};

export const getNearByRestaurant = async (restaurantId: string) => {
  const response = await apiClient.get(`/restaurants/${restaurantId}/nearby`);
  return response.data;
};

export const getRestaurantVideo = async (restaurantId: string) => {
  const response = await apiClient.get(`/videos?restaurantId=${restaurantId}`);
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
