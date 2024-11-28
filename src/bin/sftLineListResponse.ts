import { BasicAPIResponse } from "./basicAPIResponse";
import { SftLineListResponseLineCodeName } from "./SftLineListResponseLineCodeName";


export interface SftLineListResponse extends BasicAPIResponse {
    lineCodeNames: Array<SftLineListResponseLineCodeName>;
}
