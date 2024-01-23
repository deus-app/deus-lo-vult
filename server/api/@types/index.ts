export type User = {
  id: string;
  name: string;
};

export type TaskModel = {
  id: string;
  label: string;
  done: boolean;
  createdTime: number;
  image: { url: string; s3Key: string } | undefined;
  author: { userId: string; name: string };
};

export const SERVICE_STATUS = ['finished', 'unfinished'] as const;
export const IDEA_STATUS = ['complete', 'incomplete', 'unreceived'] as const;

export type ServiceModel = {
  id: string;
  area: string;
  name: string | undefined;
  similarName: string | undefined;
  status: 'finished' | 'unfinished';
  createdAt: number;
  ideas: IdeaModel[];
};

export type IdeaModel = {
  id: string;
  name: string;
  description: string;
  status: 'complete' | 'incomplete' | 'unreceived';
  createdAt: number;
  feedback: FeedbackModel | undefined;
};

export type FeedbackModel = {
  id: string;
  feedback: string;
  createdAt: number;
};
