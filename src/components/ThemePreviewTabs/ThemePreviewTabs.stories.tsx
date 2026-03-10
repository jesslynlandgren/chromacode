import type { Meta, StoryObj, StoryFn } from '@storybook/react';
import { ThemePreviewTabs } from './ThemePreviewTabs';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeEditorUIProvider } from '@/contexts/ThemeEditorUIContext';

const meta: Meta<typeof ThemePreviewTabs> = {
  title: 'Components/ThemePreviewTabs',
  component: ThemePreviewTabs,
  tags: ['autodocs'],
  decorators: [
    (Story: StoryFn) => (
      <ThemeProvider>
        <ThemeEditorUIProvider>
          <div style={{ height: '500px', width: '800px' }}>
            <Story />
          </div>
        </ThemeEditorUIProvider>
      </ThemeProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ThemePreviewTabs>;

export const Default: Story = {};
