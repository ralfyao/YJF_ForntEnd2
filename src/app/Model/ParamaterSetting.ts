import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from '../Enum/session-enum.enum';
/**參數設定基底物件
 * @export
 * @abstract
 * @class ParameterModelBase
 */
export abstract class ParameterModelBase {
    constructor(private session: SessionStorageService) { }
    public GetValue(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        return v;
    }

    public GetLoginAccount() {
        let v: string = this.session.retrieve(LoginSessionEnum.UserAccount);
        if (v == null || v == undefined) {
            v = "";
        }
        return v;
    }
}

/**報價種類資料模型
 * @export
 * @class ShutDownRepListModel
 * @extends {ParameterModelBase}
 */
export class ShutDownRepListModel extends ParameterModelBase {
  private shutdownReps: Array<ShutDownRep> = new Array<ShutDownRep>();
      /**錯誤原因資料物件
     * @type {Array<ShutDownRep>}
     * @memberof ShutDownRepListModel
     */
      public get ShutDownRep(): Array<ShutDownRep> {
        return this.shutdownReps;
    }
    public set ShutDownRep(v: Array<ShutDownRep>) {
        this.shutdownReps = v;
    }

    private totalCount: string;
    /**總筆數
     * @type {string}
     * @memberof ShutDownRepListModel
     */
    public get TotalCount(): string {
        return this.totalCount;
    }
    public set TotalCount(v: string) {
        this.totalCount = v;
    }

    private workStatus: string;
    /**執行結果
     * @type {string}
     * @memberof ShutDownRepListModel
     */
    public get WorkStatus(): string {
        return this.workStatus;
    }
    public set WorkStatus(v: string) {
        this.workStatus = v;
    }

    private errorMsg: string;
    /**錯誤訊息
     * @type {string}
     * @memberof ShutDownRepListModel
     */
    public get ErrorMsg(): string {
        return this.errorMsg;
    }
    public set ErrorMsg(v: string) {
        this.errorMsg = v;
    }
}


/**報價種類資料模型
 * @export
 * @class QuoteTypeListModel
 * @extends {ParameterModelBase}
 */
export class QuoteTypeListModel extends ParameterModelBase {

    private quoteTypeReps: Array<QuoteTypeRep> = new Array<QuoteTypeRep>();
    /**報價種類資料物件
     * @type {Array<QuoteTypeRep>}
     * @memberof QuoteTypeListModel
     */
    public get QuoteTypeReps(): Array<QuoteTypeRep> {
        return this.quoteTypeReps;
    }
    public set QuoteTypeReps(v: Array<QuoteTypeRep>) {
        this.quoteTypeReps = v;
    }


    private totalCount: string;
    /**總筆數
     * @type {string}
     * @memberof QuoteTypeListModel
     */
    public get TotalCount(): string {
        return this.totalCount;
    }
    public set TotalCount(v: string) {
        this.totalCount = v;
    }


    private workStatus: string;
    /**執行結果
     * @type {string}
     * @memberof QuoteTypeListModel
     */
    public get WorkStatus(): string {
        return this.workStatus;
    }
    public set WorkStatus(v: string) {
        this.workStatus = v;
    }


    private errorMsg: string;
    /**錯誤訊息
     * @type {string}
     * @memberof QuoteTypeListModel
     */
    public get ErrorMsg(): string {
        return this.errorMsg;
    }
    public set ErrorMsg(v: string) {
        this.errorMsg = v;
    }
}

export class SupplierMailList{
  QuoteItemNumber:string = "";
  QuoteTypeName:string = "";
  IsEmail:string = "";
  Representative:string = "";
  SupplierListString:string = "";
  Mailto :boolean=false;
  FORM_QuotationDetail_ID:string="";
}

/**停機原因資料回傳物件
 * @export
 * @class ShutDownRep
 */
export class ShutDownRep extends ParameterModelBase {
  public SYS_ShutDown_ID:string;
  public ShutDownName:string;
  public Representative:string;
}

/**停機原因新增資料傳遞物件
 * @export
 * @class AddShutDownReq
 * @extends {ParameterModelBase}
 */
export class AddShutDownReq extends ParameterModelBase {

  private _puoteTypeName: string;
  /**取得或設定停機原因名稱
   * @type {string}
   * @memberof AddShutDownReq
   */
  public get ShutDownName(): string {
      return this.GetValue(this._puoteTypeName);
  }
  public set ShutDownName(v: string) {
      this._puoteTypeName = v;
  }
  public Representative:string;
  private _loginAccount: string;
  /**取得或設定登入帳號
   * @type {string}
   * @memberof AddShutDownReq
   */
}

/**停機原因修改資料傳遞物件
 * @export
 * @class UpdateShutDown
 * @extends {ParameterModelBase}
 */
export class UpdateShutDown extends ParameterModelBase {
  private _sYS_ShutDown_ID: string = "";
  /**取得或設定停機原因ID
   * @type {string}
   * @memberof ShutDownRep
   */
  public get SYS_ShutDown_ID(): string {
      return this.GetValue(this._sYS_ShutDown_ID);
  }
  public set SYS_ShutDown_ID(v: string) {
      this._sYS_ShutDown_ID = v;
  }
  public Representative:string;

  private _ShutDownName: string = "";
  /**取得或設定停機原因名稱
   * @type {string}
   * @memberof ShutDownRep
   */
  public get ShutDownName(): string {
      return this.GetValue(this._ShutDownName);
  }
  public set ShutDownName(v: string) {
      this._ShutDownName = v;
  }
}

/**報價種類資料回傳物件
 * @export
 * @class QuoteTypeRep
 */
export class QuoteTypeRep extends ParameterModelBase {
    public SYS_QuoteType_ID:string;
    public QuoteTypeName:string;
    public Representative:string;
    public PartNo:string;
}


/**新增報價種類新增資料傳遞物件
 * @export
 * @class AddQuoteTypeReq
 * @extends {ParameterModelBase}
 */
export class AddQuoteTypeReq extends ParameterModelBase {

    private _puoteTypeName: string;
    /**取得或設定報價種類名稱
     * @type {string}
     * @memberof AddQuoteTypeReq
     */
    public get QuoteTypeName(): string {
        return this.GetValue(this._puoteTypeName);
    }
    public set QuoteTypeName(v: string) {
        this._puoteTypeName = v;
    }
    public Representative:string;
    public PartNo:string;
    private _loginAccount: string;
    /**取得或設定登入帳號
     * @type {string}
     * @memberof AddQuoteTypeReq
     */
}

/**修改報價種類修改資料傳遞物件
 * @export
 * @class UpdateQuoteType
 * @extends {ParameterModelBase}
 */
export class UpdateQuoteType extends ParameterModelBase {

    private _sYS_QuoteType_ID: string = "";
    /**取得或設定報價種類ID
     * @type {string}
     * @memberof QuoteTypeRep
     */
    public get SYS_QuoteType_ID(): string {
        return this.GetValue(this._sYS_QuoteType_ID);
    }
    public set SYS_QuoteType_ID(v: string) {
        this._sYS_QuoteType_ID = v;
    }
    public Representative:string;
    public PartNo:string;

    private _quoteTypeName: string = "";
    /**取得或設定報價種類名稱
     * @type {string}
     * @memberof QuoteTypeRep
     */
    public get QuoteTypeName(): string {
        return this.GetValue(this._quoteTypeName);
    }
    public set QuoteTypeName(v: string) {
        this._quoteTypeName = v;
    }
}

/* #endregion */


/* #region  材料種類 */

/**新增材料片語資料傳遞物件
 * @export
 * @class AddMaterialReq
 * @extends {ParameterModelBase}
 */
export class AddMaterialReq extends ParameterModelBase {
    private _materialType: string;
    public get MaterialType(): string {
        return this.GetValue(this._materialType);
    }
    public set MaterialType(v: string) {
        this._materialType = v;
    }


    private _materialReqs: Array<MaterialReq> = new Array<MaterialReq>();
    /**取得或設定陣列物件
     * @type {Array<MaterialReq>}
     * @memberof AddMaterialReq
     */
    public get MaterialReqs(): Array<MaterialReq> {
        return this._materialReqs;
    }
    public set MaterialReqs(v: Array<MaterialReq>) {
        this._materialReqs = v;
    }
}

/**材料資料新增片語陣列物件
 * @export
 * @class MaterialReq
 * @extends {ParameterModelBase}
 */
export class MaterialReq {
    private materialNo: string;
    /**取得或設定材料品號 (銅:5009 錫:5010)
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialNo(): string {
        return this.materialNo;
    }
    public set MaterialNo(v: string) {
        this.materialNo = v;
    }

    private materialWeight: string;
    /**取得或設定領退料重量(處理後的數字)
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialWeight(): string {
        return this.materialWeight;
    }
    public set MaterialWeight(v: string) {
        this.materialWeight = v;
    }

    private materialType: string;
    /**取得或設定材料種類
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialType(): string {
        return this.materialType;
    }
    public set MaterialType(v: string) {
        this.materialType = v;
    }

    private materialName: string;
    /**取得或設定材料名稱
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialName(): string {
        return this.materialName;
    }
    public set MaterialName(v: string) {
        this.materialName = v;
    }
}

/**刪除材料片語
 * @export
 * @class DeleteMaterial
 * @extends {ParameterModelBase}
 */
export class DeleteMaterialReq extends ParameterModelBase {

    private _sYS_Material_ID: string;
    /**取得或設定要刪除的材料片語ID
     * @type {string}
     * @memberof DeleteMaterialReq
     */
    public get SYS_Material_ID(): string {
        return this.GetValue(this._sYS_Material_ID);
    }
    public set SYS_Material_ID(v: string) {
        this._sYS_Material_ID = v;
    }
}

/**傳入查詢材料列表資料
 * @export
 * @class MaterialListReq
 * @extends {ParameterModelBase}
 */
export class MaterialListReq {

    private _materialNo: string;
    /**取得或設定材料品號 (銅:5009 錫:5010)
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialNo(): string {
        return this._materialNo;
    }
    public set MaterialNo(v: string) {
        this._materialNo = v;
    }

    private _materialName: string;
    /**取得或設定材料名稱
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialName(): string {
        return this._materialName;
    }
    public set MaterialName(v: string) {
        this._materialName = v;
    }

    private _materialType: string;
    /**取得或設定材料種類
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialType(): string {
        return this._materialType;
    }
    public set MaterialType(v: string) {
        this._materialType = v;
    }

}

export class MaterialListModel extends ParameterModelBase {

    private _materialListReps: Array<MaterialListRep> = new Array<MaterialListRep>();
    /**材料列表資料
     * @type {Array<MaterialListRep>}
     * @memberof MaterialListModel
     */
    public get MaterialListReps(): Array<MaterialListRep> {
        return this._materialListReps;
    }
    public set MaterialListReps(v: Array<MaterialListRep>) {
        this._materialListReps = v;
    }

    /**總筆數
     * @private
     * @type {string}
     * @memberof MaterialListModel
     */
    private _totalCount: string = "";
    public get TotalCount(): string {
        return this._totalCount;
    }
    public set TotalCount(v: string) {
        this._totalCount = v;
    }


    private _workStatus: string;
    /**執行結果
     * @type {string}
     * @memberof MaterialListModel
     */
    public get WorkStatus(): string {
        return this._workStatus;
    }
    public set WorkStatus(v: string) {
        this._workStatus = v;
    }



}

/**材料查詢回傳物件
 * @export
 * @class MaterialListRep
 * @extends {ParameterModelBase}
 */
export class MaterialListRep extends ParameterModelBase {
    private _sYS_Material_ID: string;
    /**取得或設定要刪除的材料片語ID
     * @type {string}
     * @memberof DeleteMaterialReq
     */
    public get SYS_Material_ID(): string {
        return this.GetValue(this._sYS_Material_ID);
    }
    public set SYS_Material_ID(v: string) {
        this._sYS_Material_ID = v;
    }

    private _materialNo: string;
    /**取得或設定材料品號 (銅:5009 錫:5010)
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialNo(): string {
        return this.GetValue(this._materialNo);
    }
    public set MaterialNo(v: string) {
        this._materialNo = v;
    }

    private _materialName: string;
    /**取得或設定材料名稱
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialName(): string {
        return this.GetValue(this._materialName);
    }
    public set MaterialName(v: string) {
        this._materialName = v;
    }

    private _materialType: string;
    /**取得或設定材料種類
     * @type {string}
     * @memberof MaterialReq
     */
    public get MaterialType(): string {
        return this.GetValue(this._materialType);
    }
    public set MaterialType(v: string) {
        this._materialType = v;
    }
}

/* #endregion */
