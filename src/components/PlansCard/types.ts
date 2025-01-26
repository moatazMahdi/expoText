export interface plansItem {
  planID: number;
  title: { en: string; ar: string };
  description: string;
  maxTenor: number;
  minTenor: number;
  downPayment: number;
  allowDownPayment: number;
  interestRate: number;
}
