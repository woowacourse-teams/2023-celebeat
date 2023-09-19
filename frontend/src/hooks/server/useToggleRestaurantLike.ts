import { shallow } from 'zustand/shallow';
import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import useToastState from '~/hooks/store/useToastState';
import useBooleanState from '~/hooks/useBooleanState';

import type { Restaurant } from '../../@types/restaurant.types';
import type { RestaurantListData } from '../../@types/api.types';
import { postRestaurantLike } from '~/api/user';

const useToggleRestaurantLike = (restaurant: Restaurant) => {
  const queryClient = useQueryClient();
  const { value: isModalOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);
  const { onSuccess, onFailure, close } = useToastState(
    state => ({
      onSuccess: state.onSuccess,
      onFailure: state.onFailure,
      close: state.close,
    }),
    shallow,
  );

  const toggleLike = useMutation({
    mutationFn: postRestaurantLike,
    onMutate: () => {
      const previousRestaurantListData: RestaurantListData = queryClient.getQueryData(['restaurants']);
      const newRestaurantListData = previousRestaurantListData?.content.map(restaurantItem =>
        restaurantItem.id === restaurant.id ? { ...restaurantItem, isLiked: !restaurantItem.isLiked } : restaurantItem,
      );

      queryClient.setQueryData(['restaurants'], newRestaurantListData);

      return { previousRestaurantListData };
    },

    onError: (error: AxiosError, newData, context) => {
      if (error.response.status < 500) {
        openModal();
      } else {
        onFailure(error.response.data as string);
      }

      if (context.previousRestaurantListData) {
        queryClient.setQueriesData(['restaurants'], context.previousRestaurantListData);
      }
    },

    onSuccess: () => {
      const message = `위시리스트에 ${!restaurant.isLiked ? '저장' : '삭제'}되었습니다.`;
      const imgUrl = restaurant.images[0].name;

      onSuccess(message, { url: imgUrl, alt: `좋아요한 ${restaurant.name}` });
    },

    onSettled: () => {
      queryClient.invalidateQueries(['restaurants']);
    },
  });

  const toggleRestaurantLike = useCallback(() => {
    toggleLike.mutate(restaurant.id);
    close();
  }, []);

  return { isModalOpen, openModal, closeModal, toggleRestaurantLike };
};

export default useToggleRestaurantLike;
