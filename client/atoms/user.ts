import { atom } from 'jotai';
import type { User } from '../api/@types';

export const userAtom = atom<User | null>(null);
