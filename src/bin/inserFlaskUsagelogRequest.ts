import { FlaskList } from "src/app/Model/production";

export interface InserFlaskUsagelogRequest {
    Account: string;
    PartNo: string;
    CurrentLineCode: string;
    CurrentProductionLineCode: string;
    ProductionHeadOrder: string;
    ProductionOrder: string;
    FlaskSelectList: FlaskList;
}
