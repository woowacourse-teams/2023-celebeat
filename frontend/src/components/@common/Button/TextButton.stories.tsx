/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';
import { styled } from 'styled-components';
import TextButton from './TextButton';

function TextButtons() {
  return (
    <StyledTextButtons>
      <section>
        <h2>Dark Button</h2>
        <div>
          <h5>disabled</h5>
          <TextButton type="button" text="dark button" colorType="dark" onClick={() => alert('clicked')} disabled />
          <h5>default</h5>
          <TextButton type="button" text="dark button" colorType="dark" onClick={() => alert('clicked')} />
        </div>
      </section>
      <section>
        <h2>light Button</h2>
        <div>
          <h5>disabled</h5>
          <TextButton type="button" text="light button" colorType="light" onClick={() => alert('clicked')} disabled />
          <h5>default</h5>
          <TextButton type="button" text="light button" colorType="light" onClick={() => alert('clicked')} />
        </div>
      </section>
    </StyledTextButtons>
  );
}

const meta: Meta<typeof TextButtons> = {
  title: 'TextButton',
  component: TextButtons,
};

export default meta;

type Story = StoryObj<typeof TextButtons>;

export const Buttons: Story = {};

const StyledTextButtons = styled.div`
  display: flex;
  gap: 0 12.4rem;

  & > section > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;

    & > * {
      display: flex;
      justify-content: center;
      align-items: center;

      margin: 0.8rem;
    }
  }
`;
