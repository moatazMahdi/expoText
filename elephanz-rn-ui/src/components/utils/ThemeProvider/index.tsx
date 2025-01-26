import React, {
  useState,
  useEffect,
} from 'react';
import {
  Theme,
} from '../../../theming/Theme';
import {
  ThemeContext,
} from '../../../theming/context';

type Props<T> = ThemeFactoryProps<T> | ThemeProps;

interface ThemeFactoryProps<T extends Exclude<any, undefined>> {
  theme: ThemeFactory<T>;
  dependencies: T;
}

interface ThemeProps {
  theme: Theme;
  dependencies: undefined;
}

type ThemeFactory<T> = (dependencies: T) => Theme;

function isThemeFactoryProps<T>(props: ThemeProps | ThemeFactoryProps<T>): props is ThemeFactoryProps<T> {
  return typeof props.theme === 'function';
}

function isThemeFactory<T>(theme: Theme | ThemeFactory<T>): theme is ThemeFactory<T> {
  return typeof theme === 'function';
}

function getInitialTheme<T>(props: Props<T>) {
  if (!props.theme) {
    return new Theme();
  }
  if (isThemeFactoryProps(props)) {
    return props.theme(props.dependencies);
  }
  return props.theme;
}

function getInitialThemeFactory<T>(theme?: Theme | ThemeFactory<T>) {
  if (!theme) {
    return null;
  }
  if (isThemeFactory(theme)) {
    return {
      factory: theme,
    };
  }
  return null;
}

export function ThemeProvider<T>(props: React.PropsWithChildren<Props<T>>) {
  const {
    theme,
    children,
    dependencies,
  } = props;
  const [currentTheme, setCurrentTheme] = useState<Theme>(getInitialTheme(props));
  const [currentThemeFactory, setCurrentThemeFactory] = useState<{
    factory: ThemeFactory<T>
  } | null>(getInitialThemeFactory(theme));

  useEffect(() => {
    if (currentThemeFactory && typeof currentThemeFactory.factory === 'function' && dependencies !== undefined) {
      setCurrentTheme(currentThemeFactory.factory(dependencies));
    }
  }, [dependencies, currentThemeFactory]);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: (cTheme: Theme | ThemeFactory<T>) => {
          if (isThemeFactory(cTheme)) {
            if (dependencies !== undefined) {
              setCurrentTheme(cTheme(dependencies));
              setCurrentThemeFactory({
                factory: cTheme,
              });
            }
          } else {
            setCurrentTheme(cTheme);
          }
        },
      }}

    >
      {children}
    </ThemeContext.Provider>
  );
}
