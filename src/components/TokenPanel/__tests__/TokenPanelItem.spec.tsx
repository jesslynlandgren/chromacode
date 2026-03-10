import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TokenPanelItem } from '../TokenPanelItem';

describe('TokenPanelItem', () => {
  it('renders label', () => {
    render(
      <TokenPanelItem
        tokenKey="workbench:editor.background"
        label="Background"
        color="#1e1e1e"
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Background')).toBeInTheDocument();
  });

  it('calls onSelect with tokenKey when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <TokenPanelItem
        tokenKey="workbench:editor.background"
        label="Background"
        color="#1e1e1e"
        isSelected={false}
        onSelect={onSelect}
      />,
    );
    await user.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith('workbench:editor.background');
  });

  it('applies selected styles when isSelected is true', () => {
    render(
      <TokenPanelItem
        tokenKey="workbench:editor.background"
        label="Background"
        color="#1e1e1e"
        isSelected={true}
        onSelect={vi.fn()}
      />,
    );
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-accent');
  });

  it('shows hex color value', () => {
    render(
      <TokenPanelItem
        tokenKey="workbench:editor.background"
        label="Background"
        color="#1e1e1e"
        isSelected={false}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('#1E1E1E')).toBeInTheDocument();
  });
});
