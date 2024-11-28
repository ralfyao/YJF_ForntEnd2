import { ApartList } from "src/app/Model/vo";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface ComApartmentListResponse extends BasicAPIResponse {
    apartmentlist: Array<ApartList>;
    TotalCount: number;
}
