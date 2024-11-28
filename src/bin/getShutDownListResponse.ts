import { BasicAPIResponse } from "./basicAPIResponse";
import { GetShutDownListResponseShutDownDetail } from "./getShutDownListResponseShutDownDetail";
import { GetShutDownListResponseShutDownList } from "./getShutDownListResponseShutDownList";

export interface GetShutDownListResponse extends BasicAPIResponse {
    ShutDownList: Array<GetShutDownListResponseShutDownDetail>;
    ShutDownDetail: Array<GetShutDownListResponseShutDownList>
}
