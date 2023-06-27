import { DefaultApiResponse, PaginationReponse } from "./general";

export type CandidateType = {
  id_user?: string;
  name: string;
  email: string;
  phone_number: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CandidateApiResponseType = DefaultApiResponse &
  PaginationReponse & {
    data: CandidateType[];
  };

export type InsertManyCandidateApiResponseType = DefaultApiResponse & {
  data: {
    id_order?: string;
    id_candidates: string[];
  };
};

export type InsertManyCandidateType = {
  id_order: any;
  id_candidates: any[];
};

export type DetailCandidateApiResponseType = DefaultApiResponse &
  PaginationReponse & {
    data: CandidateType;
  };

export type CandidatePostApiResponseType = DefaultApiResponse & {
  data: CandidateType;
};

export type PatchCandidateType = {
  body: CandidateType;
  id?: string | string[];
};
