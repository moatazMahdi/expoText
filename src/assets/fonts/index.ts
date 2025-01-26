import { Platform } from 'react-native';

export class Fonts {
  static bold = 'Agrandir-TextBold';

  static regular = Platform.OS == 'android' ? 'agrandir' : 'Agrandir-Regular';

  static grand = 'Agrandir-Grand';

  static narrow = 'Agrandir-Narrow';

  static tight = 'Agrandir-Tight';

  static narrowBlack = 'Agrandir-NarrowBlack';

  static tightBlack = 'Agrandir-TightBlack';

  static grandLight = 'Agrandir-GrandLight';

  static tightThin = 'Agrandir-TightThin';

  static wideLight = 'Agrandir-WideLight';

  static arabic = Platform.OS == 'android' ? 'baloobhaijaan2' : 'BalooBhaijaan2-Regular';
}
