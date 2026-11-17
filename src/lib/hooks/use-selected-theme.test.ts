import { renderHook } from '@testing-library/react-native';

import { useSelectedTheme } from './use-selected-theme';

describe('useSelectedTheme', () => {
  it('defaults to dark when nothing has been stored yet', async () => {
    const { result } = await renderHook(() => useSelectedTheme());

    expect(result.current.selectedTheme).toBe('dark');
  });
});
