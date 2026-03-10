import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TokenPanelItem } from './TokenPanelItem';

const meta: Meta<typeof TokenPanelItem> = {
  title: 'Components/TokenPanelItem',
  component: TokenPanelItem,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TokenPanelItem>;

export const Unselected: Story = {
  args: {
    tokenKey: 'workbench:editor.background',
    label: 'Background',
    color: '#1e1e1e',
    isSelected: false,
    onSelect: fn(),
  },
};

export const Selected: Story = {
  args: {
    tokenKey: 'workbench:editor.background',
    label: 'Background',
    color: '#1e1e1e',
    isSelected: true,
    onSelect: fn(),
  },
};

export const NoColor: Story = {
  args: {
    tokenKey: 'workbench:editor.background',
    label: 'Background',
    color: '',
    isSelected: false,
    onSelect: fn(),
  },
};
