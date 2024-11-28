export interface LineProductionScheduleListRequest {
    Account: string;
    pouringDateStart?: string;
    pouringDateEnd?: string;
    WorkOrder?:string;
    PartNo?:string;
    queryLocked?:boolean;
}
