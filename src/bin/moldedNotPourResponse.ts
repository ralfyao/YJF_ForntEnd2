import { BasicAPIResponse } from "./basicAPIResponse";
import { MoldedNotPour } from "./moldNotPour";

export interface MoldedNotPourResponse extends BasicAPIResponse{
  resultList:Array<MoldedNotPour>;
}
