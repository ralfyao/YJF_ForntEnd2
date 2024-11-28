import { RecalLineProdScheduleRequestWoStationDates } from "./recalLineProdScheduleRequestWoStationDates";

export interface RecalLineProdScheduleRequest {
    Account: string;
    woStationDates: Array<RecalLineProdScheduleRequestWoStationDates>;
    WorkOrder?:string;
    PartNo?:string;
}
