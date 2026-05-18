export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
  status: string;
  createdAt: string;
}

export type AuthUser = Omit<AppUser, "password">;

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  institution: string;
}
