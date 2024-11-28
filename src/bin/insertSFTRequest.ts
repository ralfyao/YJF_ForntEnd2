import { WIPProcess } from "src/app/Model/production";

export interface InsertSFTRequest {
    Account: string;
    WIPProcess: WIPProcess;
}
