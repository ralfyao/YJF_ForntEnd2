import { BasicAPIResponse } from "./basicAPIResponse";
import { POMOCTAPURCheckListResponsePOMOCTAPURCheckList } from "./pOMOCTAPURCheckListResponsePOMOCTAPURCheckList";

export interface POMOCTAPURCheckListResponse extends BasicAPIResponse {
    POMOCTAPURCheckList: Array<POMOCTAPURCheckListResponsePOMOCTAPURCheckList>;
}
