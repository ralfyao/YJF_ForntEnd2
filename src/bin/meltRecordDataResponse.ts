import { BasicAPIResponse } from "./basicAPIResponse";
import { MeltRecordDataResponseReportList } from "./meltRecordDataResponseReportList";

export interface MeltRecordDataResponse extends BasicAPIResponse {
    reportlist: Array<MeltRecordDataResponseReportList>
}
