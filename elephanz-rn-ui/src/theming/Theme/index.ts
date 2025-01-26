import { ThemePalette } from '../Palette';
import { ThemeShape } from '../Shape';
import { ThemeSpacing } from '../Spacing';
import { ThemeTypography } from '../Typography';
import { RecursivePartialNonMethod } from '../../utils';
import { CustomeThemeStyles } from './types';

export class Theme<T extends Partial<CustomeThemeStyles> = {}> {
  palette = new ThemePalette();

  shape = new ThemeShape();

  spacing = new ThemeSpacing();

  typography: ThemeTypography<T['typography'] extends undefined ? {} : Exclude<T['typography'], undefined>> =
    new ThemeTypography();

  statusBarHeight: number;

  constructor(t?: RecursivePartialNonMethod<Theme<T>>) {
    if (t) {
      if (t.palette) {
        this.palette = new ThemePalette(t.palette);
      }
      if (t.shape) {
        this.shape = new ThemeShape(t.shape);
      }
      if (t.spacing) {
        this.spacing = new ThemeSpacing(t.spacing);
      }
      if (t.typography) {
        this.typography = new ThemeTypography<
          T['typography'] extends undefined ? {} : Exclude<T['typography'], undefined>
        >(t.typography as any);
      }
    }
  }
}

export * from './types';
