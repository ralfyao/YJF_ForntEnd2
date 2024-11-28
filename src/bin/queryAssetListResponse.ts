import { AssetList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface QueryAssetListResponse extends BasicAPIResponse {
    QueryAssetList: Array<AssetList>;
    TotalCount: number
}
