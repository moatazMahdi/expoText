import {
  ViewStyle,
} from 'react-native';
import deepMerge from 'lodash/merge';
import {
  RecursivePartialNonMethod,
} from '../../utils';

export class ThemeShape {
  borderRadius = 4;

  borderWidth = 1;

  borderStyle: ViewStyle['borderStyle'] = 'solid';

  borderBottomEndRadius: ViewStyle['borderBottomEndRadius'];

  borderBottomLeftRadius: ViewStyle['borderBottomLeftRadius'];

  borderBottomRightRadius: ViewStyle['borderBottomRightRadius'];

  borderBottomStartRadius: ViewStyle['borderBottomStartRadius'];

  borderBottomWidth: ViewStyle['borderBottomWidth'];

  borderLeftWidth: ViewStyle['borderLeftWidth'];

  borderRightWidth: ViewStyle['borderRightWidth'];

  borderTopEndRadius: ViewStyle['borderTopEndRadius'];

  borderTopLeftRadius: ViewStyle['borderTopLeftRadius'];

  borderTopRightRadius: ViewStyle['borderTopRightRadius'];

  borderTopStartRadius: ViewStyle['borderTopStartRadius'];

  borderTopWidth: ViewStyle['borderTopWidth'];

  constructor(t?: RecursivePartialNonMethod<ThemeShape>) {
    if (t) {
      deepMerge(this, t);
    }
  }

  SelectWidth(value: number | undefined) {
    if (value) {
      return value;
    }
    return this.borderWidth;
  }

  SelectRadius(value: number | undefined) {
    if (value) {
      return value;
    }
    return this.borderRadius;
  }

  get borderRadiusStyles() {
    return {
      borderTopLeftRadius: this.SelectRadius(this.borderTopLeftRadius),
      borderTopRightRadius: this.SelectRadius(this.borderTopRightRadius),
      borderBottomLeftRadius: this.SelectRadius(this.borderBottomLeftRadius),
      borderBottomRightRadius: this.SelectRadius(this.borderBottomRightRadius),
    };
  }

  get borderWidthStyles() {
    return {
      borderTopWidth: this.SelectWidth(this.borderTopWidth),
      borderBottomWidth: this.SelectWidth(this.borderBottomWidth),
      borderLeftWidth: this.SelectWidth(this.borderLeftWidth),
      borderRightWidth: this.SelectWidth(this.borderRightWidth),
    };
  }
}
