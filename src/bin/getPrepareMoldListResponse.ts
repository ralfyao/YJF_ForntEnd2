import { BasicAPIResponse } from "./basicAPIResponse";
import { GetPrepareMoldListResponsePrepareList } from "./getPrepareMoldListResponsePrepareList";

export interface GetPrepareMoldListResponse extends BasicAPIResponse {
    PrepareList: Array<GetPrepareMoldListResponsePrepareList>;
    RetuenList: Array<any>;
}
