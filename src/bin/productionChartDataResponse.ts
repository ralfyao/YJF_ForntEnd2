import { MainProductionOrder } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ProductionChartDataResponse extends BasicAPIResponse {
    allscheles: Array<MainProductionOrder>
}
