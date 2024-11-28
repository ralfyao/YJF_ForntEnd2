import { BasicAPIResponse } from "./basicAPIResponse";

export interface PourableDataResponse extends BasicAPIResponse
{
  result:Map<string, Array<any>>;
  groupSummary:Map<string, Array<any>>;
}
