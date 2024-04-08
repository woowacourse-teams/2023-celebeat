import type { Meta, StoryObj } from '@storybook/react';
import LoginButton from './LoginButton';

const meta: Meta<typeof LoginButton> = {
  title: 'Oauth/LoginButton',
  component: LoginButton,
};

export default meta;

type Story = StoryObj<typeof LoginButton>;

export const Google: Story = {
  args: { type: 'google' },
};

export const KaKao: Story = {
  args: { type: 'kakao' },
};

export const Naver: Story = {
  args: { type: 'naver' },
};
