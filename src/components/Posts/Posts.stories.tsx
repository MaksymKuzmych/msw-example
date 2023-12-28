import type { Meta, StoryObj } from '@storybook/react';

import { expect } from '@storybook/jest';

import { Posts } from './Posts';
import { handlers } from '../../mocks/browser';
import { userEvent, waitFor, within } from '@storybook/testing-library';

const meta = {
  title: 'UI/Posts',
  component: Posts,
  parameters: {
    msw: {
      handlers: handlers,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Posts>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getAllByTestId('post').length).not.toBe(0)
    );

    const postsLength = canvas.getAllByTestId('post').length;

    await step('Enter title', async () => {
      await userEvent.type(canvas.getByTestId('myInput'), 'dummy string');
    });

    await step('Submit', async () => {
      await userEvent.click(canvas.getByTestId('button'));
    });

    await waitFor(() =>
      expect(canvas.getAllByTestId('post').length).not.toBe(2)
    );

    const afterPostsLength = canvas.getAllByTestId('post').length;

    await waitFor(() => expect(afterPostsLength).toBeGreaterThan(postsLength));
  },
};
