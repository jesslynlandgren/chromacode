import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ColorPicker } from './ColorPicker';

const meta: Meta<typeof ColorPicker> = {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {
  args: {
    tokenKey: 'editor.background',
    tokenLabel: 'Background',
    value: '#1e1e1e',
    onChange: fn(),
  },
};

export const WithScope: Story = {
  args: {
    tokenKey: 'textmate:comment',
    tokenLabel: 'Comment',
    tokenScope: 'comment',
    value: '#6a9955',
    onChange: fn(),
  },
};

export const LightColor: Story = {
  args: {
    tokenKey: 'editor.background',
    tokenLabel: 'Background',
    value: '#ffffff',
    onChange: fn(),
  },
};
