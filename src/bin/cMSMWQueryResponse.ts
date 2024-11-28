import { ProductionLineCode } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface CMSMWQueryResponse extends BasicAPIResponse {
    ProductionLineCode: Array<ProductionLineCode>
}
