import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorPicker } from '../ColorPicker';

// react-colorful doesn't render well in jsdom; mock it
vi.mock('react-colorful', () => ({
  HexColorPicker: ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
    <input
      data-testid="hex-picker"
      value={color}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe('ColorPicker', () => {
  it('renders token label', () => {
    render(
      <ColorPicker
        tokenKey="editor.background"
        tokenLabel="Background"
        value="#1e1e1e"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Background')).toBeInTheDocument();
  });

  it('renders token key', () => {
    render(
      <ColorPicker
        tokenKey="editor.background"
        tokenLabel="Background"
        value="#1e1e1e"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('editor.background')).toBeInTheDocument();
  });

  it('calls onChange when a valid hex is typed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorPicker
        tokenKey="editor.background"
        tokenLabel="Background"
        value="#1e1e1e"
        onChange={onChange}
      />,
    );
    // Two textboxes render: the mocked HexColorPicker and the manual hex input.
    // Target the manual hex input (maxlength="9"), not the color picker mock.
    const inputs = screen.getAllByRole('textbox');
    const input = inputs.find((el) => el.getAttribute('maxlength') === '9')!;
    await user.clear(input);
    await user.type(input, '#ff0000');
    await user.tab();
    expect(onChange).toHaveBeenCalledWith('#ff0000');
  });
});
