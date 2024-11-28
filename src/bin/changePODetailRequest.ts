import { CusOrder } from "src/app/Model/production";

export interface ChangePODetailRequest {
    Account: string;
    POstatusList: CusOrder;
}
