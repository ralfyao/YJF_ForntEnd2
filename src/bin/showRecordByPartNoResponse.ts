import { CusOrder, MainProductionOrder, PurchaseRecord, StockRecord } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ShowRecordByPartNoResponse extends BasicAPIResponse {
    ProductionOrderList: Array<MainProductionOrder>;
    CusOrderList: Array<CusOrder>;
    StockRecordList: Array<StockRecord>;
    PurchaseRecordList: Array<PurchaseRecord>;
}
