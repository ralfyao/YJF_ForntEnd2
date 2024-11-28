import { BasicAPIResponse } from "./basicAPIResponse";
import { ProductionOrderListResponseOrderList } from "./productionOrderListResponseOrderList";
import { ProductionOrderListResponseScheduleTableList } from "./productionOrderListResponseScheduleTableList";

export interface ProductionOrderListResponse extends BasicAPIResponse {
    OrderList: Array<ProductionOrderListResponseOrderList>;
    ScheduleTableList: Array<ProductionOrderListResponseScheduleTableList>;
}

