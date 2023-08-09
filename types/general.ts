export type DefaultApiResponse = {
  status: boolean;
  message: string;
};

export type PaginationReponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
