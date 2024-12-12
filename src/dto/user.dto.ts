export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserNameDto {
  name: string;
}

export interface UpdateUserEmailDto {
  email: string;
  password: string;
}

export interface UpdateUserPasswordDto {
  password: string;
  "new-password": string;
  "confirmed-new-password": string;
}

export interface DeleteUserDto {
  password: string;
}
