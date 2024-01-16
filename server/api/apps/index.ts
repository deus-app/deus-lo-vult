import type { DefineMethods } from 'aspida';
import type { ServiceModel } from '../@types/models';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
    };
    resBody: ServiceModel[];
  };
}>;
