export interface UserProfile {
  uid: string;
  shortId: string;
  phone: string;
  password?: string;
  displayName: string;
  role: 'user' | 'admin';
  isActiveUntil: number | null;
  trialPostsCount?: number;
  trialScriptsCount?: number;
  createdAt: number;
}

export interface ActivationKey {
  id: string;
  used: boolean;
  createdAt: number;
  days?: number;
  posts?: number;
  scripts?: number;
}

export interface GlobalStats {
  aiRequestsCount: number;
  lastResetDate: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
  }
}
