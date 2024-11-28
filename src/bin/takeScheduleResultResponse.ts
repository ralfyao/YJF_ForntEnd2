import { BasicAPIResponse } from "./basicAPIResponse";
import { TakeScheduleResultResponseSchedulingList } from "./takeScheduleResultResponseSchedulingList";

export interface TakeScheduleResultResponse extends BasicAPIResponse {
    SchedulingList: Array<TakeScheduleResultResponseSchedulingList>
}
