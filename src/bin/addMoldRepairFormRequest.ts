export interface AddMoldRepairFormRequest {
    Account: string;
    lineCode: string;
    patFlasNo: string;
    patFlasType: number;
    description: string;
    status: number;
    workOrder?: string;
    pics?: Array<FileList>;
    type?: string;
}
