import type { User } from 'api/@types';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    resBody: User;
  };
}>;
