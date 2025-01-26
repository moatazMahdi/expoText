import { RequestForm } from '../product';
import { BaseDTO } from '../types';

export interface ProgramSection {
  sectionName: string;
  sectionBody: string;
  order: number;
}

export class Program extends BaseDTO {
  id: string;

  order: number;

  imageUrl: string;

  contactProgramId: number;

  title: string;

  description: string;

  sections?: ProgramSection[];
}

export class Article extends BaseDTO {
  id: number;
  title: string;
  description: string;
  backgroundImage: string;
  brandingColor: string;
  createdAt: string;
  updatedAt: string;
  navigateTo: string;
  sections: {
    id: number;
    name: string;
    body: string;
    languageCode: string;
    articleId: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export class ProgramRequestForm extends RequestForm {
  brand?: string;

  model?: string;

  modelYear?: number;

  buyerName?: string;

  buyerPhone?: string;

  buyerEmail?: string;

  needHelp?: boolean;
}

export class SupplementRequestForm {
  name: string;
  mobile: string;
  email: string;
  branch: string;
}

export enum Programs {
  TRADE_IN = 'TRADE_IN',
  HOMES = 'HOMES',
  REWARDS = 'REWARDS',
  REFERRAL = 'REFERRAL'
}
