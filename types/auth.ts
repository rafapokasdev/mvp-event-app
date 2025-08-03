export interface User {
  id: number;
  email: string;
  name: string;
}

export interface StaticUser extends User {
  password: string;
  type: 'admin' | 'user';
}

export interface LoginResult {
  success: boolean;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  userType: 'admin' | 'user' | null;
  staticUsers: StaticUser[];
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

