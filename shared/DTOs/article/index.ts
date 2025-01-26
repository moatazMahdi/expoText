import {
  BaseDTO,
} from '../types';

export class Article extends BaseDTO {
  id: string;

  createdAt: string;

  name: string;

  avatar: string;
}
