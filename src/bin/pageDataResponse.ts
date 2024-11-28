import { PageDataResponsePageList } from "./PageDataResponsePageList";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface PageDataResponse extends BasicAPIResponse {
    PageList: Array<PageDataResponsePageList>;
}
