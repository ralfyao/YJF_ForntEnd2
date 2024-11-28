export interface ExportSftRecordDataRequest {
    Account: string;
    Searchtxt: string;
    StatusSelectedList: string;
    OrderStatus: string;
    ScheduleStartday: string;
    ScheduleEndday: string;
    BillingStartday: string;
    BillingEndday: string;
    ProductionLine: string;
    OrdererrStatus: string;
    woSchStatus: string;
    soLights:Array<{text:string;value:boolean}>;
    woLights:Array<{text:string;value:boolean}>;
}
