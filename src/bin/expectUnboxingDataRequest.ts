export interface ExpectUnboxingDataRequest {
    Account: string;
    MoldingStartDate: string;
    MoldingEndDate: string;
    ETDFilterStartDate: string;
    ETDFilterEndDate: string;
    UnboxingPlanStartDate2?:string;
    UnboxingPlanStartDate2End?:string;
    UnboxingStartDate: string;
    UnboxingEndDate: string;
    ProductionOrderText: string;
    ItemCodeText: string;
    FlaskText: string;
    orderType: string;
    productionStatus:string;
}
