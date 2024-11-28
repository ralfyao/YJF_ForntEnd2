import { MainProductionOrder } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ProductionStateListDataResponse extends BasicAPIResponse {
    ScheduleList: Array<MainProductionOrder>;
}
