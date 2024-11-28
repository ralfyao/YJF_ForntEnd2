import { NavigationGroup, NavigationItem } from "src/app/Model/NavigationData";
import { BasicAPIResponse } from "./basicAPIResponse";
import { Page } from "src/app/Model/PermissionData";

export interface MenuDataResponse extends BasicAPIResponse {
    MenuGroupList: Array<NavigationGroup>;
    MenuList: Array<NavigationItem>;
    PageList: Array<Page>;
}
