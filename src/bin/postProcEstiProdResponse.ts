import { BasicAPIResponse } from "./basicAPIResponse";
import { MoldedNotPour } from "./moldNotPour";
import { PostProcEstiProd } from "./postProcEstiProd";

export interface PostProcEstiProdResponse extends BasicAPIResponse{
  result:Array<PostProcEstiProd>;
}
