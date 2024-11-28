import { BasicAPIResponse } from "./basicAPIResponse";
import { SplitOrderListResponseSplitOrderList } from "./splitOrderListResponseSplitOrderList";

export interface SplitOrderListResponse extends BasicAPIResponse {
    SplitOrderList: Array<SplitOrderListResponseSplitOrderList>
}
