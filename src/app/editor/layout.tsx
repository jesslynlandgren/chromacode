import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeEditorUIProvider } from '@/contexts/ThemeEditorUIContext';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeEditorUIProvider>{children}</ThemeEditorUIProvider>
    </ThemeProvider>
  );
}
