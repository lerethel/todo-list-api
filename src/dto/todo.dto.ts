export interface CreateTodoDto {
  title: string;
  description: string;
}

export interface FindTodoDto {
  page: string;
  limit: string;
  date?: string;
  sort?: string;
}
