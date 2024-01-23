import type { UserEntity } from 'api/@types';
import { atom } from 'jotai';

export const userAtom = atom<UserEntity | null>(null);
