import { CommonPhrasesListRequest } from "./commonPhrasesListRequest";

export interface QueryProdCapacityRequest extends CommonPhrasesListRequest{
  StartDate:string;
  EndDate:string;
}
