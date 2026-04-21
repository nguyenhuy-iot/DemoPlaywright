export type LoginExpectation = 'success' | 'fail';

export interface LoginUser {
  id: string;
  username: string;
  password: string;
  expected: LoginExpectation;
  description: string;
}

export const users: LoginUser[] = [
  {
    id: 'user-01',
    username: 'standard_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Valid standard user',
  },
  {
    id: 'user-02',
    username: 'problem_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Valid problem user',
  },
  {
    id: 'user-03',
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Valid performance glitch user',
  },
  {
    id: 'user-04',
    username: 'error_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Valid error user',
  },
  {
    id: 'user-05',
    username: 'visual_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Valid visual user',
  },
  {
    id: 'user-06',
    username: 'standard_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Second valid standard user login',
  },
  {
    id: 'user-07',
    username: 'visual_user',
    password: 'secret_sauce',
    expected: 'success',
    description: 'Second valid visual user login',
  },
  {
    id: 'user-08',
    username: 'standard_user',
    password: 'wrong_password',
    expected: 'fail',
    description: 'Invalid password for a valid user',
  },
  {
    id: 'user-09',
    username: 'problem_user',
    password: 'wrong_password',
    expected: 'fail',
    description: 'Another invalid password case',
  },
  {
    id: 'user-10',
    username: 'locked_out_user',
    password: 'secret_sauce',
    expected: 'fail',
    description: 'Locked user account',
  },
];
