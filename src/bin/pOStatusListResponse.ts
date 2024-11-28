import { BasicAPIResponse } from "./basicAPIResponse";
import { POStatusListResponseCastingOutSouceList } from "./pOStatusListResponseCastingOutSouceList";
import { POStatusListResponsePOstatusList } from "./pOStatusListResponsePOstatusList";

export interface POStatusListResponse extends BasicAPIResponse {
    POstatusList: Array<POStatusListResponsePOstatusList>;
    CastingOutSouceList: Array<POStatusListResponseCastingOutSouceList>
}
