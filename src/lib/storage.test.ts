import { getItem, removeItem, setItem, storage } from './storage';

// react-native-mmkv is mocked in jest-setup.ts; these tests drive that mock
// and check what storage.tsx does with what MMKV returns.
const getString = jest.mocked(storage.getString);

describe('getItem', () => {
  afterEach(() => {
    getString.mockReset();
  });

  it('returns null for a key that was never stored', () => {
    getString.mockReturnValue(undefined);
    expect(getItem('key')).toBeNull();
  });

  it('parses the stored JSON', () => {
    getString.mockReturnValue('{"theme":"dark","count":2}');
    expect(getItem('key')).toEqual({ theme: 'dark', count: 2 });
    expect(getString).toHaveBeenCalledWith('key');
  });

  it('treats a stored falsy JSON value as absent', () => {
    getString.mockReturnValue('false');
    expect(getItem('key')).toBeNull();
  });
});

describe('setItem and removeItem', () => {
  it('stores the value as JSON', async () => {
    await setItem('key', { theme: 'dark' });
    expect(storage.set).toHaveBeenCalledWith('key', '{"theme":"dark"}');
  });

  it('removes the key', async () => {
    await removeItem('key');
    expect(storage.remove).toHaveBeenCalledWith('key');
  });
});
