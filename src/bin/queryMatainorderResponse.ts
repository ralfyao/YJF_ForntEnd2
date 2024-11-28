import { MaintainOrderList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface QueryMatainorderResponse extends BasicAPIResponse {
    MaintainOrderList: MaintainOrderList;
    ApartName: string;
    EmpName: string;
    AssetSpec: string;
    AssetName: string;
    AssetNo: string;
}
