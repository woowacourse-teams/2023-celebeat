import type { Meta, StoryObj } from '@storybook/react';
import RestaurantDetailInfo from './RestaurantDetailInfo';

const meta: Meta<typeof RestaurantDetailInfo> = {
  title: 'RestaurantDetailInfo',
  component: RestaurantDetailInfo,
};

export default meta;

type Story = StoryObj<typeof RestaurantDetailInfo>;

export const Default: Story = {
  args: {
    imageUrl:
      'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzAzMjhfMjY1%2FMDAxNjc5OTk0NjYxMDI5.Mo-i3h1Q8kR4yi0hOL2lQZdA6t6uiQ599aBNnnJ83q8g._NGlnMeHtVCiJVWenUbbtICefoddkW1Wg0g3PCxn9Q4g.JPEG.twinkle_paul%2F100V7467-2.jpg',
    name: '카와카츠',
    address: '서울 마포구 양화로 78-7 1층 카와카츠',
    category: '일식',
    rating: '4.3',
    reviewCount: 1000,
    phoneNumber: '010-1234-5678',
  },
};
