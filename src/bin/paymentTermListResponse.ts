import { PaymentTermList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface PaymentTermListResponse extends BasicAPIResponse {
    paymenttermlist: Array<PaymentTermList>;
    TotalCount: number
}
