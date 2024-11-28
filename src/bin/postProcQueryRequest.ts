import { BasicAPIRequest } from "./basicAPIRequest";

export interface PostProcQueryRequest extends BasicAPIRequest{
  prodcSelected:string;
  type:string;
  date:string;
}
