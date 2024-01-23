import type { TaskEntity } from 'api/@types';
import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqFormat: FormData;
    reqBody: {
      label: string;
      image?: Blob;
    };
    resBody: TaskEntity;
  };

  patch: {
    reqBody: {
      taskId: string;
      done: boolean;
      label: string;
    };
    status: 204;
    resBody: TaskEntity;
  };

  delete: {
    reqBody: {
      taskId: string;
    };
    status: 204;
  };
}>;
