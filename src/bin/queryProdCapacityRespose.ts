import { ProductionCapacity } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";


export interface QueryProdCapacityResponse extends BasicAPIResponse{
  loadingData:Record<string,Array<ProductionCapacity>>;
  lineCodeList:Array<string>;
  lineNameList:Array<string>;
}


