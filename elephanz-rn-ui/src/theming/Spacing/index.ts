import deepMerge from 'lodash/merge';
import {
  RecursivePartialNonMethod,
} from '../../utils';

export class ThemeSpacing {
  unit = 8;

  constructor(t?: RecursivePartialNonMethod<ThemeSpacing>) {
    if (t) {
      deepMerge(this, t);
    }
  }

  spacing(input: number) {
    if (this.unit) {
      return input * this.unit;
    }
    return input * 8;
  }
}
