export interface CreateTodoDto {
  title: string;
  description: string;
}

export interface FindTodoDto {
  page: number;
  limit: number;
  date?: string;
  sort?: string;
}

export interface CreateTodoReturnDto {
  id: unknown;
  title: string;
  description: string;
  createdAt?: Date;
}

export interface FindTodoReturnDto {
  data: { id: unknown; title: string; description: string; createdAt?: Date }[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UpdateTodoReturnDto {
  id: unknown;
  title: string;
  description: string;
}
