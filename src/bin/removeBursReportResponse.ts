import { BasicAPIResponse } from "./basicAPIResponse";
import { RemoveBursReport } from "./removeBursReport";

export interface RemoveBursReportResponse extends BasicAPIResponse{
  resultList:RemoveBursReport[];
  resultDict:Map<string, any>;
  ExcelFilePath:string;
}
