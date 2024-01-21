import type { DefineMethods } from 'aspida';
import type { User } from '../@types';

export type Methods = DefineMethods<{
  post: {
    resBody: User;
  };
}>;
