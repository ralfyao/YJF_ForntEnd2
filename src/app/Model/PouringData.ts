import { DateTime } from "ts-luxon";


/**Model_新增爐前管制資料
 * @export
 * @class Model_AddPouringData
 * @param POU_PouringData_ID 澆注設置ID
 * @param StartTime ＊開始溶燒時間
 * @param EndTime ＊結束溶燒時間
 * @param PouringTemp ＊溶燒溫度
 * @param MaterialType ＊材料種類
 * @param CE ＊CE值
 * @param CEC ＊C%
 * @param CESi ＊Si%
 * @param Wedge1 組成契值
 * @param Wedge2 處理契值
 * @param PouringContainer ＊開爐容器編號
 * @param PouringBatch ＊開爐次數
 * @param EngName 操作人編號
 * @param PouringMaterialReqs ＊澆注材料資料(PouringMaterial Array)
 * @param POU_PouringChemicalContent_ID 爐前後分光檢查ID
 * @param B_C 爐前C
 * @param B_Cr 爐前Cr
 * @param B_Cu 爐前Cu
 * @param B_Mg 爐前Mg
 * @param B_Mn 爐前Mn
 * @param B_P 爐前P
 * @param B_S 爐前S
 * @param B_Si 爐前Si
 * @param B_Sn 爐前Sn
 * @param B_Ti 爐前Ti
 * @param A_C 爐後C
 * @param A_Cr 爐後Cr
 * @param A_Cu 爐後Cu
 * @param A_Mg 爐後Mg
 * @param A_Mn 爐後Mn
 * @param A_P 爐後P
 * @param A_S 爐後S
 * @param A_Si 爐後Si
 * @param A_Sn 爐後Sn
 * @param A_Ti 爐後Ti
 * @param A_LoginAccount 操作帳號
 */
export class Model_AddPouringData {
    POU_PouringData_ID?: string = "";
    StartTime?: string = "";
    EndTime?: string = "";
    PouringTemp?: string = "";
    MaterialType?: string = "";
    CE?: string = "";
    CEC?: string = "";
    CESi?: string = "";
    Wedge1?: string = "";
    Wedge2?: string = "";
    PouringContainer?: string = "";
    PouringBatch?: string = "";
    EngName?: string = "";
    PouringMaterialReqs?: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>();
    POU_PouringChemicalContent_ID?: string = "";
    B_C?: string = "";
    B_Cr?: string = "";
    B_Cu?: string = "";
    B_Mg?: string = "";
    B_Mn?: string = "";
    B_P?: string = "";
    B_S?: string = "";
    B_Si?: string = "";
    B_Sn?: string = "";
    B_Ti?: string = "";
    A_C?: string = "";
    A_Cr?: string = "";
    A_Cu?: string = "";
    A_Mg?: string = "";
    A_Mn?: string = "";
    A_P?: string = "";
    A_S?: string = "";
    A_Si?: string = "";
    A_Sn?: string = "";
    A_Ti?: string = "";
    LoginAccount?: string = "";
}

/**新增爐前管制資料_Response
 * @export
 * @class Model_AddPouringData_Response
 */
export class Model_AddPouringData_Response {
    POU_PouringData_ID?: string = "";
    WorkStatus?: string = "";
    ErrorMsg?: string = "";
}

/**Model_澆注材料(SinglePouringData)
 * @export
 * @class Model_PouringMaterial
 * @param POU_PouringMaterial_ID 澆注材料ID
 * @param MaterialType ＊材質
 * @param MaterialNo ＊材料編號
 * @param MaterialName ＊材料名稱
 * @param MaterialQTY ＊數量
 */
export class Model_AddPouringMaterial {
    POU_PouringMaterial_ID?: string = "";
    MaterialType?: string = "";
    MaterialNo?: string = "";
    MaterialName?: string = "";
    MaterialQTY?: string = "";
}

/**Model_澆注材料(Source)
 * @export
 * @class Model_PouringMaterial
 */
export class Model_PouringMaterial {
    MaterialType?: string = "";
    MaterialNo?: string = "";
    MaterialName?: string = "";
    MaterialWeight?: string = "0";
    StockQuantity:Number=0;
    IsParamater?: boolean = false;
}

export class QueryMaterialStock{
  MaterialNo:string='';
  MaterialName:string='';
  StockQTY:number =0;
  StockInDate:Date = new Date();
  StockOutDate:Date = new  Date();
  RunningStock :number = 0;
}
export class MaterialColumn{
  ColumnString:string;
  ColumnList:Array<string>;
}

export class PouringWeight {
  POU_PouringOutRecord_ID:string ='';
  Date:Date = new Date();
  BatchWeight:number = 0;
  ProductWeight:number = 0;
}

/**Model_爐前管制表單一詳細資料
 * @export
 * @class Model_SinglePouringDataDetail
 * @param POU_PouringData_ID 澆注設置ID
 * @param PDID 澆注編號
 * @param date_id 澆注時間
 * @param StartTime ＊開始溶燒時間
 * @param EndTime ＊結束溶燒時間
 * @param PouringTemp ＊溶燒溫度
 * @param MaterialType ＊材料種類
 * @param CE ＊CE值
 * @param CEC ＊C%
 * @param CESi ＊Si%
 * @param Wedge1 組成契值
 * @param Wedge2 處理契值
 * @param PouringContainer ＊開爐容器編號
 * @param PouringBatch ＊開爐次數
 * @param EngName 操作人編號
 * @param PouringMaterialReqs ＊澆注材料資料(PouringMaterial Array)
 * @param POU_PouringChemicalContent_ID 爐前後分光檢查ID
 * @param B_C 爐前C
 * @param B_Cr 爐前Cr
 * @param B_Cu 爐前Cu
 * @param B_Mg 爐前Mg
 * @param B_Mn 爐前Mn
 * @param B_P 爐前P
 * @param B_S 爐前S
 * @param B_Si 爐前Si
 * @param B_Sn 爐前Sn
 * @param B_Ti 爐前Ti
 * @param A_C 爐後C
 * @param A_Cr 爐後Cr
 * @param A_Cu 爐後Cu
 * @param A_Mg 爐後Mg
 * @param A_Mn 爐後Mn
 * @param A_P 爐後P
 * @param A_S 爐後S
 * @param A_Si 爐後Si
 * @param A_Sn 爐後Sn
 * @param A_Ti 爐後Ti
 * @param WorkStatus 操作帳號
 * @param ErrorMsg 操作帳號
 */
export class Model_SinglePouringDataDetail {
    POU_PouringData_ID?: string = "";
    PDID?: string = "";
    date_id?: string = new Date().getFullYear().toString() + "/" + (new Date().getMonth() + 1).toString() + "/" + new Date().getDate().toString();
    StartTime?: string = new Date().getHours().toString() + ":" + new Date().getMinutes.toString();
    EndTime?: string = new Date().getHours().toString() + ":" + new Date().getMinutes.toString();
    PouringTemp?: string = "0";
    MaterialType?: string = "FC300";
    CE?: string = "0";
    CEC?: string = "0";
    CESi?: string = "0";
    Wedge1?: string = "0";
    Wedge2?: string = "0";
    PouringContainer?: string = "A";
    PouringBatch?: string = "0";
    EngName?: string = "";
    PouringMaterialReps?: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>();
    POU_PouringChemicalContent_ID?: string = "0";
    IsReturnToZero?: string = "0";
    B_C?: string = "0";
    B_Cr?: string = "0";
    B_Cu?: string = "0";
    B_Mg?: string = "0";
    B_Mn?: string = "0";
    B_P?: string = "0";
    B_S?: string = "0";
    B_Si?: string = "0";
    B_Sn?: string = "0";
    B_Ti?: string = "0";
    A_C?: string = "0";
    A_Cr?: string = "0";
    A_Cu?: string = "0";
    A_Mg?: string = "0";
    A_Mn?: string = "0";
    A_P?: string = "0";
    A_S?: string = "0";
    A_Si?: string = "0";
    A_Sn?: string = "0";
    A_Ti?: string = "0";
    WorkStatus?: string = "";
    ErrorMsg?: string = "";
}

/**爐前管制記錄列表資料
 * @export
 * @class Model_PouringDataListItem
 * @param POU_PouringData_ID 澆注設置ID
 * @param PDID 澆注編號
 * @param PouringContainer 開爐容器編號
 * @param PouringBatch 開爐次數
 * @param EngName 操作人編號
 * @param CreateDate 建立日期
 */
export class Model_PouringDataListItem {
    POU_PouringData_ID?: string = "";
    PDID?: string = "";
    PouringContainer?: string = "";
    PouringBatch?: string = "";
    EngName?: string = "";
    Date?: string = "";
    TotalPouringBatch?: string = "";
}


