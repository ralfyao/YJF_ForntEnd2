import { Outsourced } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface OutsourcedDataResponse extends BasicAPIResponse {
    OutsourcedData: Array<Outsourced>;
}
