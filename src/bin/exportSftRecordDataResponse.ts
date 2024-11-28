import { BasicAPIResponse } from "./basicAPIResponse";

export interface ExportSftRecordDataResponse extends BasicAPIResponse {
    ExcelFilePath: string;
}
