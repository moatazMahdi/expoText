import { BaseDTO } from '../types';

export class VerifyPhoneResponse extends BaseDTO {
  isSuccessful: boolean;

  message: string;

  otpResEncoded: string;

  data: any;
}

export class LogoutResponse extends BaseDTO {
  isSuccessful: boolean;
}

export class PhoneHasPassword extends BaseDTO {
  hasPassword: boolean;
}

export class UpdatePassword extends BaseDTO {
  message: string;
  token: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export class ActivateVerifyPhoneResponse extends BaseDTO {
  clientMobileLastThreeDigits: string;

  otpResEncoded: string;
}

export class ActivateUserResponse extends BaseDTO {}

export class UpgradeLimit extends BaseDTO {
  status: 'true' | 'false' | 'duplicated';
}

export class Login extends BaseDTO {
  phone: string;
  code: string;
  sessionId?: string;
}

export class Register extends BaseDTO {
  phone: string;
  password: string;
  name: string;
  verificationToken: string;
  sessionId?: string;
}

export class LoginResponse extends BaseDTO {
  isSuccessful: boolean;

  message: string;

  token: {
    expiresIn: string;
    accessToken: string;
    refreshToken: string;
  };

  userId: number;
}
