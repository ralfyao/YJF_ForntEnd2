export interface LineProductionScheduleListResponseResult {
    workOrderWeight: string;//單重
    EstimatedTargetDay: string;//預計出貨日
    EstimatedWOCompleteDay: string;//預計完成日
    customerAlias: string;//客戶簡
    orderNumber: string;//訂單別 - 單號
    workOrderNumber: string;//製令單單別 - 單號
    flaskNo: string;//鐵斗編號
    patternStartDay: string;//木模起始日期
    patternEndDay: string;//木模結束日期
    patternEnded:boolean;//木模是否完工
    moldingGroup: string;//造模組別
    moldingStartDay: string;//造模起始日期
    moldingEndDay: string;//造模結束日期
    moldingEnded:boolean;//造模是否完工
    moldClosingGroup: string;//合模組別
    moldClosingStartDay: string;//合模起始日期
    moldClosingEndDay: string;//合模結束日期
    moldClosingEnded:boolean;//合模是否完工
    pouringStartDay: string;//澆注起始日期
    pouringEndDay: string;//澆注結束日期
    pouringEnded:boolean;//澆注是否完工
    unpackStartDay: string; //拆箱起始日期
    unpackEndDay: string; //拆箱結束日期
    unpackEnded:boolean;//澆注是否完工
    isLocked: boolean;
    PartNo: string;//品號
    PartDesc: string;//品名
    annelProcStartDay: string; //退火開始日
    annelProcEndDay: string; //退火結束日
    annelEnded:boolean;//澆注是否完工
    deRoughEdgeProcStartDay: string; //去毛邊開始日
    deRoughEdgeProcEndDay: string; //去毛邊結束日
    deRoughEdgeProcEnded:boolean;//去毛邊是否完工
    post3ProcStartDay: string;//後處理3
    post3ProcEndDay: string;
    post3ProcEnded:boolean;//後處理3是否完工
    post4ProcStartDay: string;//後處理4
    post4ProcEndDay: string;
    post4ProcEnded:boolean;//後處理4是否完工
    post5ProcStartDay: string;//後處理5
    post5ProcEndDay: string;
    post5ProcEnded:boolean;//後處理5是否完工
    isOverCapacity: boolean | string;//是否超過負荷
    toolTipString:string;
}
