import { BasicAPIResponse } from "./basicAPIResponse";

export interface ExportWoodenReportResponse extends BasicAPIResponse {
    ExcelFilePath: string;
}
