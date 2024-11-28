export interface MoldRepairFormInquireResponseRepairList {
    LineCode: string; //線別
    WorkOrder: string; //製令單號
    PatFlasNo: string; //模具編號
    PatFlasType: string; //模具類型(1:鐵斗 2:木模)
    Status: string; //表單狀態(0:申請中 1:完成)
    Description: string; //損壞說明文字
    ID: string; //資料表ID
    type: string; //上模/下模
}
