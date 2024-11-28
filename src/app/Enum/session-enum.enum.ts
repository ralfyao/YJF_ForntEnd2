/**
 * 本列舉用來記錄登入狀態Session的Key
 * @param EmployeeID 員工ID，如果帳號是員工身分有此ID，無則NULL
 * @param SupplierID 供應商ID，如果帳號是供應商身分有此ID，無則NULL
 * @param UserAccount 使用者帳號
 * @param IsFirstLogin 是否第一次登入
 * @param Name 使用者名稱
 * @param Status 狀態:使用者狀態 1.啟用 2.停用
 * @param CreateDate 帳號建立日期
 * @param AccountIdentity 帳號身份 1.員工 2.供應商
 * @param Permission 帳號權限
 */
export enum LoginSessionEnum {
    EmployeeID = "EmployeeID",
    SupplierID = "SupplierID",
    UserAccount = "UserAccount",
    IsFirstLogin = "IsFirstLogin",
    Name = "Name",
    Status = "Status",
    CreateDate = "CreateDate",
    AccountIdentity = "AccountIdentity",
    Permission = "Permission",
    YJFCode = "YJFCode"
}
export enum CommonPhrasesEnum {
  FlaskLocationList = "FlaskLocationList",
  PatternLocationList = "PatternLocationList"
}

/**
 * 紀錄頁面操作狀態，以供後續變更頁面時不需重新輸入
 */
export enum QuotationPageEnum{
  PageStatusList = "PageStatusList",
  ScheduleResult = "ScheduleResult",
  POstatusList = "POstatusList"
}

export enum RFQ_FeedbackList{
  Page = 'Page',
  SelectItem = 'SelectItem'
}

