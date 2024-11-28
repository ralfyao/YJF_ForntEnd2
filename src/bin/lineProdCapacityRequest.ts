export interface LineProdCapacityRequest {
    Account: string;
    id?: string;
    lineCode?: string;
    capacity?: number;
    affectDays?: number;
}
