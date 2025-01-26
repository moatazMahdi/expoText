import {
  BaseDTO,
} from '../types';

export class StaticText extends BaseDTO {
  keyDescription: string;

  languageCode: string;

  textKey: string;

  value: string;
}
