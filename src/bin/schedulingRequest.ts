import { SchedulingRequestPOstatusList } from "./schedulingRequestPOstatusList";

export interface SchedulingRequest {
    Account: string;
    POstatusList: Array<SchedulingRequestPOstatusList>;
}
