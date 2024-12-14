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
