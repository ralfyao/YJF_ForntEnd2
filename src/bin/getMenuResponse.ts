import { NavigationItem } from "src/app/Model/NavigationData";
import { BasicAPIResponse } from "./basicAPIResponse";

export interface GetMenuResponse extends BasicAPIResponse {
    MenuList: Array<NavigationItem>;
}
