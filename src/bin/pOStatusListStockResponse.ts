import { BasicAPIResponse } from "./basicAPIResponse";
import { POStatusListStockResponsePOstatusList } from "./pOStatusListStockResponsePOstatusList";

export interface POStatusListStockResponse extends BasicAPIResponse {
    POstatusList: Array<POStatusListStockResponsePOstatusList>
}
