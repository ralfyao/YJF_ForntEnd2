import { BasicAPIResponse } from "./basicAPIResponse";
import { CoreProductionListResponseCoreProductionOrderList } from "./coreProductionListResponseCoreProductionOrderList";

export interface CoreProductionListResponse extends BasicAPIResponse {
    CoreProductionOrderList: Array<CoreProductionListResponseCoreProductionOrderList>
}
