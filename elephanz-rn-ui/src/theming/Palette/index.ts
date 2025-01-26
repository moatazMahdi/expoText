import deepMerge from 'lodash/merge';
import { RecursivePartialNonMethod } from '../../utils/types';

export class Color {
  constructor(
    public value: string,
    public disabledValue: string,
    public contrast: string,
    public disabledContrast: string,
  ) {}
}

export class SimpleColor {
  constructor(public value: string, public contrast: string) {}
}

export class ThemePalette {
  common = {
    black: 'black',
    white: 'white',
    transparent: 'transparent',
    link: 'darkblue',
    grey: 'grey',
    lightgrey: '#AFAFAF',
    veryLightGrey: 'rgba(0, 0, 0, 0.1)',
    darkGrey: '#736F6F',
    lightSilver: '#C7C7C7',
    silver: '#C1C1C1',
    offWhite: '#F9F9F9',
    lightWhite: '#E5E5E5',
    secondaryBlue: '#0068A5',
    slightDarkBlue: '#294BA0',
    darkBlue: '#081F70',
    lightBlue: '#8E99FF',
    orange: '#EE8F21',
    lightOrange: '#FF8E0A', // #F28221
    dazzlingRed: '#D82C0D',
    creamyWhite: '#E2E5FF',
    azureishWhite: '#D8DAEF',
    yellowOrange: '#FF8E0A',
    paleRed: '#EC4949',
    lightGreen: '#2CA029',
    darkOrange: '#FD8326',
    brightGray: '#EBEBEB',
    tabsBackGround: '#FCFAFF',
    placeHolderText: '#9B9B9B',
    backGroundColor: '#F5F5F5',
    gainsboro: '#DDDDDD',
    lightTangelo: '#FDAA75',
    blackesh: '#333333',
    BillDescText: '#999999',
    green: '#56C490',
    red: '#FE5353',
    blue: '#1B0330',
    purple: '#A57BD7',
    otherBlue: '#081F6F',
    darkGray: '#4B5565',
    blueGray: '#98A2B3',
    dropDownText: '#31363F',
    dropDownSeparator: '#F0F0F0',
    lightGray: '#FAFAFA',
    brightGreen: '#039754',
    brightRed: '#E54444',
    successCard: '#039754',
    cardGray: '#E6E6E6',
    textBlack: '#020B19',
    mapBorder:"#CDD5DF"
  };

  discountApp = {
    snow: '#E5E7EB',
    dark: '#111827',
    gold: '#F58220',
    blue: '#2850E7',
  };

  others: Record<string, string> = {};

  primary = new Color('black', 'darkgrey', 'white', 'lightgrey');

  secondary = new Color('white', 'lightgrey', 'black', 'darkgrey');

  error = new Color('red', 'darkred', 'black', 'darkgrey');

  warning = new Color('yellow', 'darkyellow', 'black', 'darkgrey');

  info = new Color('lightblue', 'blue', 'black', 'darkgrey');

  success = new Color('green', 'darkgreen', 'black', 'darkgrey');

  background = new Color('white', 'white', 'black', 'black');

  surface = new Color('white', 'white', 'black', 'black');

  constructor(t?: RecursivePartialNonMethod<ThemePalette>) {
    if (t) {
      deepMerge(this, t);
    }
  }
}
