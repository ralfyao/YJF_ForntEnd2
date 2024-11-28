import { BasicAPIResponse } from "./basicAPIResponse";
import { MoldRepairFormInquireResponseRepairList } from "./moldRepairFormInquireResponseRepairList";

export interface MoldRepairFormInquireResponse extends BasicAPIResponse {
    repairList: Array<MoldRepairFormInquireResponseRepairList>
}
