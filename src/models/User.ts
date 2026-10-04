export interface User {
  id: number;
  firstName: string;
  paternalLastName: string | null;
  maternalLastName: string | null;
  fullName: string;
  email: string;
  role: string;
}

export interface RegisterUserInput {
  firstName: string;
  paternalLastName: string;
  maternalLastName: string | null;

  age: number;
  sex: string;
  phone: string;

  email: string;
  password: string;
  verificationCode: string;
}

export type LoginResult =
  | {
      status: 'authenticated';
      user: User;
    }
  | {
      status: 'mfa_required';
      email: string;
      message: string;
    };