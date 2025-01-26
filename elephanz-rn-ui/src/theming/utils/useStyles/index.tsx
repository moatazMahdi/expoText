import { useState, useEffect } from 'react';
import deepMerge from 'lodash/merge';
import deepClone from 'lodash/cloneDeep';
import { useTheme } from '../useTheme';
import { Theme } from '../../Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type SelectStyleFunction<Model extends object> = <T extends keyof Model = keyof Model>(styleKey: T) => Model[T];

export const selectStyle = <Model extends object, T extends keyof Model = keyof Model>(
  styleKey: T,
  defaultStyles: Model,
  propStyles: Partial<Model> | undefined,
  ...styleArgs: Model[T] extends (...args: any) => any ? [Parameters<Model[T]>] : []
): Model[T] extends (...args: any) => any ? ReturnType<Model[T]> : Model[T] => {
  let defaultStyle: Model[T] | ((...args: any) => Model[T]) = defaultStyles[styleKey];
  let styleValue: any = defaultStyle;
  if (!propStyles || !propStyles[styleKey]) {
    if (typeof defaultStyle === 'function') {
      return defaultStyle(...(styleArgs[0] as any));
    }
    return defaultStyle as any;
  }
  let propStyle = propStyles[styleKey];
  if (typeof defaultStyle !== typeof propStyle) {
    return styleValue;
  }
  if (typeof defaultStyle !== 'function' || typeof propStyle !== 'function') {
    styleValue = deepMerge(deepClone(defaultStyle), deepClone(propStyle));
    return styleValue;
  }
  if (typeof defaultStyle === 'function' && !styleArgs) {
    return styleValue;
  }
  defaultStyle = defaultStyle(...(styleArgs[0] as any));
  propStyle = propStyle(...(styleArgs[0] as any));
  styleValue = deepMerge(deepClone(defaultStyle), deepClone(propStyle));
  return styleValue;
};

export const createSelectStyleFunction = <Model extends object>(
  theme: Theme,
  defaultStyles: (_theme: Theme) => Model,
  propStyles?: (_theme: Theme) => Partial<Model>
) => {
  const defaultThemedStyles = defaultStyles(theme);
  let propsThemedStyles: Partial<Model> | undefined;
  if (propStyles) {
    propsThemedStyles = propStyles(theme);
  }
  return <T extends keyof Model = keyof Model>(
    styleKey: T,
    ...styleArgs: Model[T] extends (...args: any) => any ? [Parameters<Model[T]>] : []
  ) => selectStyle(styleKey, defaultThemedStyles, propsThemedStyles, ...styleArgs);
};

export const useStyles = <Model extends object>(
  defaultStyles: (theme: Theme) => Model,
  propStyles?: (theme: Theme) => Partial<Model>
) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const statusBarHeight = insets.top;

  const [styleUtils, setStyleUtils] = useState({
    selectStyle: createSelectStyleFunction({ ...theme, statusBarHeight: statusBarHeight }, defaultStyles, propStyles)
  });
  useEffect(() => {
    setStyleUtils({
      selectStyle: createSelectStyleFunction({ ...theme, statusBarHeight: statusBarHeight }, defaultStyles, propStyles)
    });
  }, [theme, defaultStyles, propStyles]);
  return styleUtils;
};
