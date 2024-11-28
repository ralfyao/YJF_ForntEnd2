/**傳入出去紀錄資料
 * @export
 * @class AddPouringOutRecordReq
 */
export class AddPouringOutRecordReq {
  /**＊填單人
   * @type {string}
   * @memberof AddPouringOutRecordReq
   */
  Creator: string;
  /**＊澆注日期
   * @type {string}
   * @memberof AddPouringOutRecordReq
   */
  Date: string;

  /**產出品項資料
   * @type {PouringOutItemReq[]}
   * @memberof AddPouringOutRecordReq
   */
  PouringOutItemReqs: PouringOutItemReq[];
  /**出水材料資料
   * @type {PouringOutMaterialReq[]}
   * @memberof AddPouringOutRecordReq
   */
  PouringOutMaterialReqs: PouringOutMaterialReq[];
  /**＊登入帳號
   * @type {string}
   * @memberof AddPouringOutRecordReq
   */
  LoginAccount: string;
}

/**產出品項資料
 * @export
 * @class PouringOutItemReq
 */
export class PouringOutItemReq {
  /**出水產品
   * @type {string}
   * @memberof PouringOutItemReq
   */
  RecordNumber: string;
  /**出水產品ID
   * @type {string}
   * @memberof PouringOutItemReq
   */
  POU_PouringOutItem_ID: string;
  /**產品型號
   * @type {string}
   * @memberof PouringOutItemReq
   */
  ItemNumber: string;
  /**＊製令單別
  * @type {string}
  * @memberof PouringOutItemReq
  */
  ProductionHeadCode: string;
  /**＊製令單號
   * @type {string}
   * @memberof PouringOutItemReq
   */
  ProductionCode: string;
  /**＊數量
   * @type {string}
   * @memberof PouringOutItemReq
   */
  Quantity: string;
  /**產品重量(Kg)
   * @type {string}
   * @memberof PouringOutItemReq
   */
  Weight: string = "0";
  /**＊澆注溫度
   * @type {string}
   * @memberof PouringOutItemReq
   */
  PouringTemp: string;
  /**＊澆注時間(秒)
   * @type {string}
   * @memberof PouringOutItemReq
   */
  PouringTime: string;
  /**產出總重
   * @type {string}
   * @memberof PouringOutItemReq
   */
  PouringOutWeight: string;
  /**盆次
   * @type {string}
   * @memberof PouringOutItemReq
   */
  Basin: string;

  /**前端再用的陣列ID
   * @type {string}
   * @memberof PouringOutItemReq
   */
  ViewIndex: string = "";

  MOQTY: number = 0;
}

/**出水材料資料
 * @export
 * @class PouringOutMaterialReq
 */
export class PouringOutMaterialReq {
  /**澆注材料ID
   * @type {string}
   * @memberof PouringOutMaterialReq
   */
  POU_PouringOutMaterial_ID: string;
  /**澆注設置ID
   * @type {string}
   * @memberof PouringOutMaterialReq
   */
  POU_PouringData_ID: string;

  /**開爐容器編號
   * @type {string}
   * @memberof PouringDataWeightRep
   */
  PouringContainer: string;
  /**開爐次數
   * @type {string}
   * @memberof PouringOutMaterialReq
   */
  PouringBatch: string;
  /**管制紀錄編號
   * @type {string}
   * @memberof PouringOutMaterialReq
   */
  PDID: string;
  /**總重(Kg)
   * @type {string}
   * @memberof PouringOutMaterialReq
   */
  TotalWeight: string;
  /**澆注材料資料
   * @type {PouringMaterialRep[]}
   * @memberof PouringOutMaterialRep
   */
  PouringMaterialReps: Array<PouringMaterialRep> = new Array<PouringMaterialRep>();
}
/**出水產品列表資料
 * @export
 * @class PouringOutItemList
 */
export class PouringOutItemList {
  /**ItemList
   * @type {PouringOutItemRep[]}
   * @memberof PouringOutItemList
   */
  PouringOutItemReps: PouringOutItemRep[];
}

/**出水產品列表資料
 * @export
 * @class PouringOutItemRep
 */
export class PouringOutItemRep {
  id: number;
  /**品號
   * @type {string}
   * @memberof PouringOutItemRep
   */
  ItemNumber: string;
  /**單重
   * @type {string}
   * @memberof PouringOutItemRep
   */
  Weight: string;
  /**製令單別
   * @type {string}
   * @memberof PouringOutItemRep
   */
  ProductionHeadCode: string;
  /**製令單號
   * @type {string}
   * @memberof PouringOutItemRep
   */
  ProductionCode: string;
  MOQTY: number;
  InQTY: number;
  ShowName: string;
}


/**產出紀錄列表Request物件
 * @export
 * @class PouringOutRecordListReq
 */
export class PouringOutRecordListReq {
  /**填單人
   * @type {string}
   * @memberof PouringOutRecordListReq
   */
  Creator: string;
  /**建檔日期(起)
   * @type {string}
   * @memberof PouringOutRecordListReq
   */
  StartCreateDate: string;
  /**建檔日期(迄)
   * @type {string}
   * @memberof PouringOutRecordListReq
   */
  EndCreateDate: string;
}

/**出水紀錄資料模型
 * @export
 * @class PouringOutRecordListModel
 */
export class PouringOutRecordListModel {
  /**出水紀錄資料
   * @type {PouringOutRecordModel[]}
   * @memberof PouringOutRecordListModel
   */
  PouringOutRecordModels: PouringOutRecordModel[];
  /**總比數
   * @type {string}
   * @memberof PouringOutRecordListModel
   */
  TotalCount: string;
}

/**出水紀錄資料
 * @export
 * @class PouringOutRecordModel
 */
export class PouringOutRecordModel {
  /**出水紀錄ID
   * @type {string}
   * @memberof PouringOutRecordModel
   */
  POU_PouringOutRecord_ID: string;
  /**填單人
   * @type {string}
   * @memberof PouringOutRecordModel
   */
  Creator: string;
  /**建檔日期
   * @type {string}
   * @memberof PouringOutRecordModel
   */
  CreateDate: string;
  /**盆次
   * @type {string}
   * @memberof PouringOutRecordModel
   */
  Basin: string;
  /**出水總重
   * @type {string}
   * @memberof PouringOutRecordModel
   */
  PouringOutTotal: string;
  /**澆注日期
   * @type {string}
   * @memberof PouringOutRecordModel
   */
  Date: string;
  /**爐次
   * @memberof PouringOutRecordModel
   */
  PouringBatch
}

/**修改產品紀錄Request物件
 * @export
 * @class UpdatePouringOutRecordReq
 */
export class UpdatePouringOutRecordReq {
  /**出水紀錄ID
   * @type {string}
   * @memberof UpdatePouringOutRecordReq
   */
  POU_PouringOutRecord_ID: string;
  /**澆注日期
   * @type {string}
   * @memberof UpdatePouringOutRecordReq
   */
  Date: string;
  /**填單人
   * @type {string}
   * @memberof UpdatePouringOutRecordReq
   */
  Creator: string;

  /**修改產出品項資料
   * @type {UpdatePouringOutItemReq[]}
   * @memberof UpdatePouringOutRecordReq
   */
  UpdatePouringOutItemReqs: Array<UpdatePouringOutItemReq> = new Array<UpdatePouringOutItemReq>();
  /**修改出水材料資料
   * @type {UpdatePouringOutMaterialReq[]}
   * @memberof UpdatePouringOutRecordReq
   */
  UpdatePouringOutMaterialReqs: Array<UpdatePouringOutMaterialReq> = new Array<UpdatePouringOutMaterialReq>();
}

/**修改產出品項資料Request物件
 * @export
 * @class UpdatePouringOutItemReq
 */
export class UpdatePouringOutItemReq {
  /**出水產品ID
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  POU_PouringOutItem_ID: string;
  /**製令單別
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  ProductionHeadCode: string;
  /**製令單號
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  ProductionCode: string;
  /**總出水重
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  PouringOutWeight: string;
  /**數量
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  Quantity: string;
  /**產品重量(Kg)
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  Weight: string;
  /**澆注溫度
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  PouringTemp: string;
  /**澆注時間(秒)
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  PouringTime: string;
  /**品號
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  ItemNumber: string;
  /**出水產品
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  RecordNumber: string;

  /**盆次
   * @type {string}
   * @memberof UpdatePouringOutItemReq
   */
  Basin: string;

}

/**修改出水材料資料
 * @export
 * @class UpdatePouringOutMaterialReq
 */
export class UpdatePouringOutMaterialReq {
  /**爐次資料ID
   * @type {string}
   * @memberof UpdatePouringOutMaterialReq
   */
  POU_PouringOutMaterial_ID: string;
  /**澆注設置ID
   * @type {string}
   * @memberof UpdatePouringOutMaterialReq
   */
  POU_PouringData_ID: string;

  /**總重(Kg)
   * @type {string}
   * @memberof UpdatePouringOutMaterialReq
   */
  TotalWeight: string;
}

/**澆注設置含重量資料-用於產出紀錄
 * @export
 * @class PouringDataWeightListReq
 */
export class PouringDataWeightListReq {
  /**澆注日期 */
  Date: string;
}

/**傳出澆注設置含重量資料清單
 * @export
 * @class PouringDataWeightListModel
 */
export class PouringDataWeightListModel {
  /**傳出澆注設置含重量資料 */
  PouringDataWeightReps: PouringDataWeightRep[];
}

/**傳出澆注設置含重量資料
 * @export
 * @class PouringDataWeightRep
 */
export class PouringDataWeightRep {
  /**管制紀錄編號
   * @type {string}
   * @memberof PouringDataWeightRep
   */
  PDID: string;
  /**澆注設置ID
   * @type {string}
   * @memberof PouringDataWeightRep
   */
  POU_PouringData_ID: string;
  /**開爐容器編號
   * @type {string}
   * @memberof PouringDataWeightRep
   */
  PouringContainer: string;
  /**開爐次數
   * @type {string}
   * @memberof PouringDataWeightRep
   */
  PouringBatch: string;

  /**材料總重量
   * @type {string}
   * @memberof PouringDataWeightRep
   */
  MaterialTotalWeight: string;
  /**澆注材料資料
   * @type {PouringMaterialRep[]}
   * @memberof PouringOutMaterialRep
   */
  PouringMaterialReps: Array<PouringMaterialRep> = new Array<PouringMaterialRep>();
  /**
   *
   * 是否已被其他表單使用
   * @type {number}
   * @memberof PouringDataWeightRep
   */
  SetByUser: number;
}

/**單筆澆注資料
 * @export
 * @class SinglePouringOutRecordDetailModel
 */
export class SinglePouringOutRecordDetailModel {

  /**出水紀錄
   * @type {string}
   * @memberof SinglePouringOutRecordDetailModel
   */
  POU_PouringOutRecord_ID: string;

  /**澆注日期
   * @type {string}
   * @memberof SinglePouringOutRecordDetailModel
   */
  Date: string;

  /**填單人
   * @type {string}
   * @memberof SinglePouringOutRecordDetailModel
   */
  Creator: string;

  /**爐次資料
   * @type {PouringOutMaterialRep[]}
   * @memberof SinglePouringOutRecordDetailModel
   */
  PouringOutMaterialReps: Array<PouringOutMaterialRep> = new Array<PouringOutMaterialRep>();

  /**出水產品紀錄資料
   * @type {PouringOutItemRecordRep[]}
   * @memberof SinglePouringOutRecordDetailModel
   */
  PouringOutItemRecordReps: Array<PouringOutItemRecordRep> = new Array<PouringOutItemRecordRep>();
  /**餘重
   * @type {string}
   * @memberof SinglePouringOutRecordDetailModel
   */
  Remaining: string;

  /**出水總重
   * @type {string}
   * @memberof SinglePouringOutRecordDetailModel
   */
  TotalPouringOutWeight: string;

}

/**爐次資料
 * @export
 * @class PouringOutMaterialRep
 */
export class PouringOutMaterialRep {
  /**爐次編號
   * @type {string}
   * @memberof PouringMaterialRep
   */
  PDID: string;
  /**澆注材料ID
   * @type {string}
   * @memberof PouringOutMaterialRep
   */
  POU_PouringOutMaterial_ID: string;
  /**澆注設置ID
   * @type {string}
   * @memberof PouringOutMaterialRep
   */
  POU_PouringData_ID: string;

  /**總重(Kg)
   * @type {string}
   * @memberof PouringOutMaterialRep
   */
  TotalWeight: string;
}

/**澆注材料Response資料
 * @export
 * @class PouringMaterialRep
 */
export class PouringMaterialRep {
  /**澆注材料ID
   * @type {string}
   * @memberof PouringMaterialRep
   */
  POU_PouringMaterial_ID: string;
  /**＊材質
   * @type {string}
   * @memberof PouringMaterialRep
   */
  MaterialType: string;
  /**＊材料編號
   * @type {string}
   * @memberof PouringMaterialRep
   */
  MaterialNo: string;
  /**＊材料名稱
   * @type {string}
   * @memberof PouringMaterialRep
   */
  MaterialName: string;
  /**＊重量
   * @type {string}
   * @memberof PouringMaterialRep
   */
  MaterialWeight: string;

  POU_PouringData_ID: string;
  ColumnList: Array<string>;
  ColumnString: string;
}

/**出水產品紀錄資料
 * @export
 * @class PouringOutItemRecordRep
 */
export class PouringOutItemRecordRep {
  /**澆注記錄編號
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  PDID: string;
  /**產出品項ID
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  POU_PouringOutItem_ID: string;
  /**領退料單號 MOCTC-TC002
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  RecordNumber: string;
  /**產品名稱
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  ItemNumber: string;
  /**出水總重
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  PouringOutWeight: string
  /**製令單別 MOCTD-TD003
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  ProductionHeadCode: string;
  /**製令單號 MOCTD-TD004
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  ProductionCode: string;
  /**數量
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  Quantity: string;
  /**重量
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  Weight: string;
  /**澆注溫度
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  PouringTemp: string;
  /**澆注時間
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  PouringTime: string;
  /**盆次
   * @type {string}
   * @memberof PouringOutItemRecordRep
   */
  Basin: string;
}
