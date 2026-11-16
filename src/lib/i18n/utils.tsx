import type TranslateOptions from 'i18next';
import type { Language, resources } from './resources';
import type { RecursiveKeyOf } from './types';
import i18n from 'i18next';
import memoize from 'lodash.memoize';
import { useCallback } from 'react';
import { I18nManager, NativeModules, Platform } from 'react-native';

import { useMMKVString } from 'react-native-mmkv';
import RNRestart from 'react-native-restart';
import { storage } from '../storage';

type DefaultLocale = (typeof resources)['en-US']['translation'];
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>;

export const LOCAL = 'local';

export const getLanguage = () => storage.getString(LOCAL); // 'Marc' getItem<Language | undefined>(LOCAL);

export const translate = memoize(
  (key: TxKeyPath, options = undefined) =>
    i18n.t(key, options) as unknown as string,
  // The active language is part of the cache key: without it a key resolved
  // once would keep returning the previous language's string after a switch.
  (key: TxKeyPath, options: typeof TranslateOptions) =>
    `${i18n.language}:${key}${options ? JSON.stringify(options) : ''}`,
);

export type ReloadStrategy = 'dev-reload' | 'restart' | 'web-reload' | 'none';

// How to rebuild the layout after a direction flip, per platform and build.
export function reloadStrategy(os: string, isDev: boolean): ReloadStrategy {
  if (os === 'web')
    return 'web-reload';
  if (os !== 'ios' && os !== 'android')
    return 'none';
  return isDev ? 'dev-reload' : 'restart';
}

const RELOADERS: Record<ReloadStrategy, () => void> = {
  'dev-reload': () => NativeModules.DevSettings.reload(),
  'restart': () => RNRestart.restart(),
  'web-reload': () => window.location.reload(),
  'none': () => {},
};

export function changeLanguage(lang: Language) {
  i18n.changeLanguage(lang);

  // Derive direction from i18next instead of hardcoding a locale list.
  const shouldBeRTL = i18n.dir(lang) === 'rtl';
  if (shouldBeRTL === I18nManager.isRTL) {
    // Same direction: React re-renders with the new strings on its own. Only a
    // direction flip needs the native layout to be rebuilt, so skip the restart
    // and keep language switching instant.
    return;
  }

  I18nManager.forceRTL(shouldBeRTL);
  RELOADERS[reloadStrategy(Platform.OS, __DEV__)]();
}

export function useSelectedLanguage() {
  const [language, setLang] = useMMKVString(LOCAL);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLang(lang);
      changeLanguage(lang);
    },
    [setLang],
  );

  return { language: language as Language, setLanguage };
}
