import { BasicAPIResponse } from "./basicAPIResponse";
import { MoldIdListResponseMoldIdList } from "./moldIdListResponseMoldIdList";

export interface MoldIdListResponse extends BasicAPIResponse {
    result: Array<MoldIdListResponseMoldIdList>;
}
