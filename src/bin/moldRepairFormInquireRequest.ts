export interface MoldRepairFormInquireRequest {
    Account: string; //系統帳號
    ID?: string; //系統ID
    moldId?: string; //模具編號
    formStatus?: string; //表單狀態(0:申請中 1:完成)
    moldType?: string;//模具類型(1:鐵斗 2:木模 3:'')
}
