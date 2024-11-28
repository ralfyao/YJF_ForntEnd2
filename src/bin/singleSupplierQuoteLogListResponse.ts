import { BasicAPIResponse } from "./basicAPIResponse";
import { SingleSupplierQuoteLogListResponseresultSupplierQuoteList } from "./singleSupplierQuoteLogListResponseresultSupplierQuoteList";

export interface SingleSupplierQuoteLogListResponse extends BasicAPIResponse {
    resultSupplierQuoteList: Array<SingleSupplierQuoteLogListResponseresultSupplierQuoteList>
}
