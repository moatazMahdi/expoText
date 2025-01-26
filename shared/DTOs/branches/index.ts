import {
  BaseDTO,
} from '../types';

export class Branch extends BaseDTO {
  title: string;

  address: string;

  phoneNumber: string;

  longitude: number;

  latitude: number;
}
