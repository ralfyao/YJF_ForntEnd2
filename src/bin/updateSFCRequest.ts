export interface UpdateSFCRequest {
    Type: string;
    UserCode: string;
    ProductionOrderHead: string;
    ProductionOrder: string;
    Sequence: number;
    WIPProcessCode: string;
    TransferDate: string;
    Quantity: Number;
    FlaskID: string;
    BottomFlaskID: string;
    WorkNumberList?:string[];
    isSupplemental?:Boolean;
}
