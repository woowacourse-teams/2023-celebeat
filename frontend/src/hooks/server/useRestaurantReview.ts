import { AxiosError } from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { shallow } from 'zustand/shallow';

import useToastState from '~/hooks/store/useToastState';

import type { RestaurantReviewData, RestaurantReviewPatchBody, RestaurantReviewPostBody } from '../../@types/api.types';
import { apiClient } from '~/api/apiClient';
import {
  deleteRestaurantReview,
  getRestaurantReview,
  patchRestaurantReview,
  postRestaurantReview,
} from '~/api/restaurantReview';

const useRestaurantReview = () => {
  const { id: restaurantId } = useParams();
  const { onFailure } = useToastState(
    state => ({
      onFailure: state.onFailure,
      onSuccess: state.onSuccess,
    }),
    shallow,
  );

  const errorHandler = (error: AxiosError) => {
    switch (error.response.status) {
      case 401:
        onFailure('로그인 후 이용 가능합니다.');
        break;
      default:
        onFailure(error.response.data as string);
        break;
    }
  };

  const { data: restaurantReviewsData, isLoading } = useQuery<RestaurantReviewData>({
    queryKey: ['restaurantReview', restaurantId, apiClient],
    queryFn: () => getRestaurantReview(restaurantId),
    suspense: true,
  });

  const createReview = useMutation({
    mutationFn: (body: RestaurantReviewPostBody) => postRestaurantReview(body),
    onError: errorHandler,
  });

  const updateReview = useMutation({
    mutationFn: ({ reviewId, body }: { reviewId: number; body: RestaurantReviewPatchBody }) =>
      patchRestaurantReview({ reviewId, body }),
    onError: errorHandler,
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId: number) => deleteRestaurantReview(reviewId),
    onError: errorHandler,
  });

  return {
    restaurantReviewsData,
    isLoading,
    createReview: createReview.mutate,
    updateReview: updateReview.mutate,
    deleteReview: deleteReview.mutate,
  };
};

export default useRestaurantReview;
