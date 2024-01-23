import type { UserEntity } from 'api/@types';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    resBody: UserEntity;
  };
}>;
