import { BasicAPIResponse } from "./basicAPIResponse";
import { ExpectUnboxingDataResponseProcessInfos } from "./expectUnboxingDataResponseProcessInfos";

export interface ExpectUnboxingDataResponse extends BasicAPIResponse {
    processInfos1?: Array<ExpectUnboxingDataResponseProcessInfos>;
    processInfos?: Array<ExpectUnboxingDataResponseProcessInfos>;
    processInfoByGroup?: Map<string, Array<ExpectUnboxingDataResponseProcessInfos>>;
}
