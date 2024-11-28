import { ProductionLineGroup } from "src/app/Model/production";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface DefectReportResponse extends BasicAPIResponse {
    ProductionGroupList: Array<ProductionLineGroup>;
    AllProductWeight: number;
    AllDefectTotalWeight: number;
    AllDefectiveRate: number;
    AllSuccessRate: number;
}
