import { BasicAPIResponse } from "./basicAPIResponse";

export interface MoldableDataResponse extends BasicAPIResponse{
  result:Map<string, Array<any>>;
  groupSummary:Map<string, Array<any>>;
}
