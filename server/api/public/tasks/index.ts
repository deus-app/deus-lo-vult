import type { DefineMethods } from 'aspida';
import type { TaskModel } from '../../@types';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
    };
    resBody: TaskModel[];
  };
}>;
