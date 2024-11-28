import { RemoveScheduleTableRequestInserScheduleRange } from "./removeScheduleTableRequestInserScheduleRange";

export interface RemoveScheduleTableRequest {
    Account: string;
    InserScheduleRange: Array<RemoveScheduleTableRequestInserScheduleRange>
}
