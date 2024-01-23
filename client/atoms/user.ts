import type { User } from 'api/@types';
import { atom } from 'jotai';

export const userAtom = atom<User | null>(null);
