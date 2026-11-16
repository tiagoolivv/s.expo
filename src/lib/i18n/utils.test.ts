import i18n from 'i18next';
import { I18nManager, NativeModules } from 'react-native';

import { changeLanguage, translate } from './index';
import { reloadStrategy } from './utils';

describe('translate', () => {
  afterAll(() => {
    changeLanguage('en-US');
  });

  it('returns strings for the language that is currently selected', () => {
    changeLanguage('en-US');
    const english = translate('home.description');

    changeLanguage('pt-BR');
    const portuguese = translate('home.description');

    expect(english).not.toBe('');
    expect(portuguese).not.toBe(english);
  });
});

describe('reloadStrategy', () => {
  it('reloads through the dev menu on a native development build', () => {
    expect(reloadStrategy('ios', true)).toBe('dev-reload');
    expect(reloadStrategy('android', true)).toBe('dev-reload');
  });

  it('restarts the app on a native release build', () => {
    expect(reloadStrategy('ios', false)).toBe('restart');
    expect(reloadStrategy('android', false)).toBe('restart');
  });

  it('reloads the page on web, in any build', () => {
    expect(reloadStrategy('web', true)).toBe('web-reload');
    expect(reloadStrategy('web', false)).toBe('web-reload');
  });

  it('does nothing on a platform it cannot reload', () => {
    expect(reloadStrategy('windows', false)).toBe('none');
  });
});

describe('changeLanguage and layout direction', () => {
  const originalDevSettings = NativeModules.DevSettings;
  const reload = jest.fn();

  beforeEach(() => {
    NativeModules.DevSettings = { reload };
    jest.spyOn(I18nManager, 'forceRTL').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    reload.mockReset();
    NativeModules.DevSettings = originalDevSettings;
  });

  it('switches language in place when the direction stays the same', () => {
    changeLanguage('pt-BR');

    expect(i18n.language).toBe('pt-BR');
    expect(I18nManager.forceRTL).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it('forces the new direction and reloads when it flips', () => {
    jest.spyOn(i18n, 'dir').mockReturnValue('rtl');

    changeLanguage('en-US');

    expect(I18nManager.forceRTL).toHaveBeenCalledWith(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
