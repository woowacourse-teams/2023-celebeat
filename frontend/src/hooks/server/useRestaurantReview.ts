import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { shallow } from 'zustand/shallow';

import { useState } from 'react';

import { useModalStore } from 'celuveat-ui-library';
import {
  deleteRestaurantReview,
  getRestaurantReview,
  patchRestaurantReview,
  postRestaurantReview,
  postRestaurantReviewLike,
  postRestaurantReviewReport,
} from '~/api/restaurantReview';

import useToastState from '~/hooks/store/useToastState';

import type { RestaurantReviewData, RestaurantReviewPatchBody } from '~/@types/api.types';

const useRestaurantReview = () => {
  const queryClient = useQueryClient();
  const { id: restaurantId } = useParams();
  const [isSubmitRequesting, setIsSubmitRequesting] = useState(false);
  const {
    onSuccess: onSuccessForReview,
    onFailure: onFailureForReview,
    close,
  } = useToastState(
    state => ({
      onFailure: state.onFailure,
      onSuccess: state.onSuccess,
      close: state.close,
    }),
    shallow,
  );

  const { closeModal } = useModalStore();

  const errorHandler = (error: AxiosError) => {
    switch (error.response.status) {
      case 401:
        onFailureForReview('로그인 후 이용 가능합니다.');
        break;
      default:
        onFailureForReview(error.response.data as string);
        break;
    }
  };

  const { data: restaurantReviewsData, isLoading } = useQuery<RestaurantReviewData>({
    queryKey: ['restaurantReview', restaurantId],
    queryFn: () => getRestaurantReview(restaurantId),
    suspense: true,
  });

  const createReview = useMutation({
    mutationFn: postRestaurantReview,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ['restaurantReview', restaurantId],
      });
      onSuccessForReview('리뷰가 성공적으로 작성되었습니다');
    },
    onError: errorHandler,
  });

  const updateReview = useMutation({
    mutationFn: patchRestaurantReview,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ['restaurantReview', restaurantId],
      });
      onSuccessForReview('작성하신 리뷰를 수정하였습니다');
    },

    onError: errorHandler,
  });

  const deleteReview = useMutation({
    mutationFn: deleteRestaurantReview,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ['restaurantReview', restaurantId],
      });
      onSuccessForReview('작성하신 리뷰를 삭제하였습니다');
    },

    onError: errorHandler,
  });

  const postReviewLike = useMutation({
    mutationFn: postRestaurantReviewLike,
    onMutate: async reviewId => {
      await queryClient.cancelQueries(['restaurantReview']);
      const previousReviews: RestaurantReviewData = queryClient.getQueryData(['restaurantReview', restaurantId]);

      let isLikedFlag = null;

      queryClient.setQueryData(['restaurantReview', restaurantId], (oldReviewsQueryData: RestaurantReviewData) => {
        const newReviewListData = oldReviewsQueryData?.reviews.map(reviewItem => {
          if (reviewItem.id === reviewId) {
            const newLikeCount = reviewItem.isLiked ? reviewItem.likeCount - 1 : reviewItem.likeCount + 1;
            isLikedFlag = !reviewItem.isLiked;

            return {
              ...reviewItem,
              isLiked: !reviewItem.isLiked,
              likeCount: newLikeCount,
            };
          }

          return reviewItem;
        });

        return { ...oldReviewsQueryData, reviews: newReviewListData };
      });

      return { previousReviews, isLikedFlag };
    },

    onSuccess: (data, reviewId, context) => {
      if (context.isLikedFlag === null) {
        return;
      }
      const message = `해당 리뷰를 추천 ${context.isLikedFlag ? '했습니다' : '취소 했습니다'}`;
      onSuccessForReview(message);
    },

    onError: (error: AxiosError, reviewId, context) => {
      queryClient.setQueryData(['restaurantReview', restaurantId], context.previousReviews);
      errorHandler(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['restaurantReview', restaurantId]);
    },
  });

  const postReviewReport = useMutation({
    mutationFn: postRestaurantReviewReport,
    onSuccess: () => {
      closeModal();
      onSuccessForReview('신고가 접수되었습니다');
    },
    onError: errorHandler,
  });

  const getReviewIsLiked = (reviewId: number) => {
    const review = restaurantReviewsData.reviews.find(reviewItem => reviewItem.id === reviewId);

    return review ? review.isLiked : null;
  };

  return {
    isLoading,
    isSubmitRequesting,
    restaurantReviewsData,
    getReviewIsLiked,
    toggleRestaurantReviewLike: (reviewId: number) => {
      setIsSubmitRequesting(true);
      postReviewLike.mutate(reviewId);
      close();
    },
    createReview: (body: FormData) => {
      setIsSubmitRequesting(true);
      createReview.mutate(body);
      close();
    },

    updateReview: ({ reviewId, body }: { reviewId: number; body: RestaurantReviewPatchBody }) => {
      setIsSubmitRequesting(true);
      updateReview.mutate({ reviewId, body });
      close();
    },

    deleteReview: (reviewId: number) => {
      setIsSubmitRequesting(true);
      deleteReview.mutate(reviewId);

      close();
    },
    postReviewReport: ({ reviewId, content }: { reviewId: number; content: string }) => {
      setIsSubmitRequesting(true);
      postReviewReport.mutate({ reviewId, content });

      close();
    },
  };
};

export default useRestaurantReview;
