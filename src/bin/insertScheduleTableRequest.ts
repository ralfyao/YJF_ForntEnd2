import { InsertScheduleTableRequestInserScheduleRange } from "./insertScheduleTableRequestInserScheduleRange";

export interface InsertScheduleTableRequest {
    Account: string;
    InserScheduleRange: Array<InsertScheduleTableRequestInserScheduleRange>
}
