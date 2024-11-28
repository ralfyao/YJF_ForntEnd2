import { BasicAPIResponse } from "./basicAPIResponse";

export interface ExportDefectReportResponse extends BasicAPIResponse {
    ExcelFilePath: string;
}
