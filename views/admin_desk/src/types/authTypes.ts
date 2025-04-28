export interface UserLocalSignUp {
  name: string;
  email: string;
  roles?: string[]; // Optional in the form
  password: string;
}