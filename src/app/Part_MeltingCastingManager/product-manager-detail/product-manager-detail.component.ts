import { Component, OnInit, Injector } from '@angular/core';
import { PermissionService } from 'src/app/Service/permission.service';
import { SessionStorageService } from 'ngx-webstorage';
import { CustomRegexPattern, CustomValidateService } from 'src/app/Service/custom-validate.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PouringProductService } from 'src/app/Service/pouring-product.service';
import { AddPouringOutRecordReq, PouringOutItemReq, PouringOutItemRep, PouringOutRecordModel, SinglePouringOutRecordDetailModel, PouringDataWeightListModel, PouringDataWeightRep, PouringOutMaterialReq, PouringMaterialRep, UpdatePouringOutRecordReq, UpdatePouringOutItemReq, PouringOutMaterialRep, PouringOutItemRecordRep } from 'src/app/Model/PouringoutData';
import { RouterState, ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material/core';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-product-manager-detail',
  templateUrl: './product-manager-detail.component.html',
  styleUrls: ['./product-manager-detail.component.css'],
  providers: [PouringProductService]
})
export class ProductManagerDetailComponent implements OnInit {

  //#region 正則表達式
  /**個位數兩位數與小數點兩位(11.11)
   * @type {string}
   * @memberof MeltingCastingManagerDetailComponent
   */
  Regular_NumberDotNumber_Pattern: string = CustomRegexPattern.NumberDotNumber;
  Regular_NumberDotNumber_Title: string = "個位數無限大，小數點最多五位(XXXXXXXXXXX.XXXXX)";

  /**兩位數(0~99)
   * @type {string}
   * @memberof MeltingCastingManagerDetailComponent
   */
  Regular_Number_Pattern: string = CustomRegexPattern.Number;
  Regular_Number_Title: string = "最多只可以輸入2位數字。";

  /**大數字(0~9999999+)
   * @type {string}
   * @memberof MeltingCastingManagerDetailComponent
   */
  Regular_BigNumber_Pattern: string = CustomRegexPattern.BigNumber;
  Regular_BigNumber_Title: string = "只可以輸入數字。";
  //#endregion

  /* #region UI資料 */

  /* #region 爐次資料  */
  /* #region 時間設定 */
  MOQTY: number = 0;
  sdate: string;
  StartDate: Date = new Date(new Date().getTime());
  settings = {
    format: 'yyyy-MM-dd'
  }
  /* #endregion */
  configs = {
    displayKey: "ItemNumber", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: '請選擇品號', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => { }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 15, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    searchOnKey: 'ItemNumber', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false // clears search criteria when an option is selected if set to true, default is false

  }

  /**爐號
   * @type {string}
   * @memberof ProductManagerDetailComponent
   */
  public selectedFurnaceNumber: string = "default";
  public FurnaceNumber: Array<string> = new Array<string>();

  /**開爐次數
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public selectedFurnaceCount: string = "default";
  public FurnaceCount: Array<string> = new Array<string>()
  /**澆注人員
   * @type {string}
   * @memberof ProductManagerDetailComponent
   */
  private CastingUserAccount: string = "";

  /**總重
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public TotalWeight: number = 0;
  /* #endregion 爐次資料*/

  /* #region  已選爐次 */
  /**已選爐次清單
   * @type {Array<PouringOutMaterialReq>}
   * @memberof ProductManagerDetailComponent
   */
  public choosedFurnaceList: Array<PouringOutMaterialReq> = new Array<PouringOutMaterialReq>()
  /**所有爐次加總重量
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public allSelectFurnaceTotlWeight: number = 0;
  /* #endregion */

  /* #region 出水紀錄 */
  public PouringOutMaterialList: Array<PouringOutMaterialReq> = new Array<PouringOutMaterialReq>();

  /**出水總重
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public TotalWeight_Out: number = 0;

  /**餘重
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public TotalWeight_Remaining: number = 0;


  /* #endregion */

  /* #region 產出品項資料 */
  /**盆次
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public BasinCounter: number = 0;

  /**澆注產品
   * @type {string}
   * @memberof ProductManagerDetailComponent
   */
  private CastingProduc: string = "";

  /**產品重量(KG)
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public Production_Weight: number = 0;

  /**澆注數量
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public CastingCount: number = 0;

  /**澆注溫度
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public CastingTemp: number = 0;

  /**澆注時間(秒)
   * @type {number}
   * @memberof ProductManagerDetailComponent
   */
  public CastingTime: string = ''

  /**YJF系統中的出水產品列表
   * @private
   * @type {Array<PouringOutItemRep>}
   * @memberof ProductManagerDetailComponent
   */
  public ProductList: Array<PouringOutItemRep> = new Array<PouringOutItemRep>();
  public ProductNameList: Array<string> = new Array<string>();
  /**以選擇的產品
   * @type {Array<PouringOutItemReq>}
   * @memberof ProductManagerDetailComponent
   */
  public ProduceOutList: Array<PouringOutItemReq> = new Array<PouringOutItemReq>();

  /**已經選擇的產品
   * @private
   * @type {PouringOutItemRep}
   * @memberof ProductManagerDetailComponent
   */
  public selectedOutProduce: PouringOutItemRep = new PouringOutItemRep();
  selectedoutid: number;

  public customOutWeight: number = 0;


  /* #endregion 產出品項資料*/

  /* #region  產品搜尋 */


  public selectProductName: string = "";




  /* #endregion */
  public LoginUserName: string = "";
  public form: FormGroup;
  public Model: SinglePouringOutRecordDetailModel;
  public selectDateFuranceWorkList: PouringDataWeightListModel = new PouringDataWeightListModel();
  public selectedFuranceWork: PouringDataWeightRep = new PouringDataWeightRep();





  /* #endregion */

  constructor(
    private router: Router,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private premanager: PermissionService,
    private formBuilder: FormBuilder,
    private rest: PouringProductService,
    private _adapter: DateAdapter<any>,
    private crypt: CustomValidateService) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['data']);
      if (data == undefined) {
        this.Model = new SinglePouringOutRecordDetailModel();
        this.StartDate = new Date(new Date().getTime());
      }
      else {
        this.Model = JSON.parse(data);
        this.StartDate = new Date(this.Model.Date);
      }
    });

  }

  ngOnInit() {
    this._adapter.setLocale('zh-tw');
    this.sdate = new Date().getFullYear().toString() + "/" + new Date().getMonth().toString() + "/" + new Date().getDate().toString();
    if (this.Model.POU_PouringOutRecord_ID != undefined || this.Model.POU_PouringOutRecord_ID != null) {
      this.importCastingLog();
    }

    this.queryItemList(this.StartDate);


  }

  queryItemList(value: Date) {
    function yyyymmdd() {
      var y = value.getFullYear().toString();
      var m = (value.getMonth() + 1).toString();
      var d = value.getDate().toString();
      (d.length == 1) && (d = '0' + d);
      (m.length == 1) && (m = '0' + m);
      var yyyymmdd = y + m + d;
      return yyyymmdd;
    }
    let qdate: string = yyyymmdd();
    this.spinnerService.show();

    this.rest.API_Query_PouringOutItemList(qdate).then(
      (list) => {
        this.ProductNameList = new Array<string>();
        this.spinnerService.hide();
        this.ProductList = list.PouringOutItemReps;

        this.CastingUserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
        this.LoginUserName = this.session.retrieve(LoginSessionEnum.Name);
        var i = 0;
        this.ProductList.forEach((P) => {
          this.ProductNameList.push(P.ItemNumber + "*" + P.MOQTY);
          P.id = i;
          P.ShowName = P.MOQTY - P.InQTY > 0 ? P.ItemNumber : P.ItemNumber + '(已選過)';
          i++;
        });


      },
      (err) => {
        this.spinnerService.hide();
        console.log(err);
      }
    );

  }

  /* #region 資料操作 */
  /**增加產品紀錄
   * @memberof ProductManagerDetailComponent
   */
  addProduceRecord() {
    let data: AddPouringOutRecordReq = new AddPouringOutRecordReq();
    data.Date = this.sdate;
    data.Creator = this.LoginUserName;
    data.LoginAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    data.PouringOutItemReqs = new Array<PouringOutItemReq>();
    this.ProduceOutList.forEach((P) => {
      let item: PouringOutItemReq = new PouringOutItemReq();
      item.ProductionHeadCode = P.ProductionHeadCode;
      item.ProductionCode = P.ProductionCode;
      item.ItemNumber = P.ItemNumber;
      item.PouringTemp = P.PouringTemp;
      item.PouringTime = P.PouringTime;
      item.Quantity = P.Quantity;
      item.PouringOutWeight = P.PouringOutWeight;
      item.Weight = P.Weight;
      item.Basin = P.Basin;
      data.PouringOutItemReqs.push(item);
    });
    data.PouringOutMaterialReqs = new Array<PouringOutMaterialReq>();
    this.choosedFurnaceList.forEach(element => {
      let met: PouringOutMaterialReq = new PouringOutMaterialReq();
      met.TotalWeight = element.TotalWeight;
      met.PDID = element.PDID;
      met.POU_PouringData_ID = element.POU_PouringData_ID;
      met.PouringBatch = element.PouringBatch;
      met.PouringContainer = element.PouringContainer;
      met.PouringMaterialReps = new Array<PouringMaterialRep>();
      data.PouringOutMaterialReqs.push(met);
    });
    console.log(data);
    if (this.choosedFurnaceList.length == 0 || this.choosedFurnaceList == undefined) {
      alert("未選擇爐次");
      return;
    }
    if (this.ProduceOutList.length == 0 || this.ProduceOutList == undefined) {
      alert("未選擇產品");
      return;
    }
    if (confirm("是否確定要新增？")) {
      this.spinnerService.show();
      this.rest.API_Insert_AddPouringOutRecord(data, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
        (result) => {
          //錯誤不繼續
          if (result['WorkStatus']=='Fail') {
            alert(result['ErrorMsg']);
            this.spinnerService.hide();
            return;
          }
          this.rest.API_Query_SinglePouringOutRecordDetail(result['POU_PouringOutRecord_ID']).then(
            (data) => {
              this.Model = new SinglePouringOutRecordDetailModel();
              this.Model.POU_PouringOutRecord_ID = data['POU_PouringOutRecord_ID'];
              this.Model.Creator = data['Creator'];
              this.Model.Date = data['Date'];
              this.Model.Remaining = data['Remaining'];
              this.Model.TotalPouringOutWeight = data['TotalPouringOutWeight'];
              data['PouringOutItemRecordReps'].forEach((element: PouringOutItemRecordRep) => {
                this.Model.PouringOutItemRecordReps.push(element);
              });
              data['PouringOutMaterialReps'].forEach((element: PouringOutMaterialRep) => {
                this.Model.PouringOutMaterialReps.push(element);
              });
              alert("新增完成");
              this.spinnerService.hide();
            }, (err) => {
              var text = err['ErrorMsg'].toString();
              alert(text);
              this.spinnerService.hide();
            })
        },
        (error) => {
          this.spinnerService.hide();
          console.log(error);
          var text = error['ErrorMsg'].toString();
          alert(text);
        }
      );
    }
  }
  /**匯入清單帶來的資料
   * @memberof ProductManagerDetailComponent
   */
  importCastingLog() {
    this.ProduceOutList = new Array<PouringOutItemReq>();
    this.Model.PouringOutItemRecordReps.forEach(element => {
      let item: PouringOutItemReq = new PouringOutItemReq();
      item.POU_PouringOutItem_ID = element.POU_PouringOutItem_ID;
      item.ProductionHeadCode = element.ProductionHeadCode;
      item.ProductionCode = element.ProductionCode;
      item.PouringTemp = element.PouringTemp;
      item.PouringTime = element.PouringTime;
      item.Quantity = element.Quantity;
      item.Weight = element.Weight;
      item.RecordNumber = element.RecordNumber;
      item.PouringOutWeight = element.PouringOutWeight;
      item.ItemNumber = element.ItemNumber;
      item.Basin = element.Basin;
      item.ViewIndex = String(this.ProduceOutList.length + 1);
      this.ProduceOutList.push(item);
    });
    this.choosedFurnaceList = new Array<PouringOutMaterialReq>();
    this.Model.PouringOutMaterialReps.forEach(element => {
      let mat: PouringOutMaterialReq = new PouringOutMaterialReq();
      mat.TotalWeight = element.TotalWeight;
      mat.PDID = element.PDID;
      mat.POU_PouringData_ID = element.POU_PouringData_ID;
      mat.POU_PouringOutMaterial_ID = element.POU_PouringOutMaterial_ID;
      this.choosedFurnaceList.push(mat);
    });
    this.caculate();
  }
  /**更新產品紀錄資料
   * @memberof ProductManagerDetailComponent
   */
  updatePouringRecord() {
    let req: UpdatePouringOutRecordReq = new UpdatePouringOutRecordReq();
    req.Creator = this.Model.Creator;
    req.Date = this.Model.Date;
    req.POU_PouringOutRecord_ID = this.Model.POU_PouringOutRecord_ID;
    this.ProduceOutList.forEach(element => {
      let item: UpdatePouringOutItemReq = new UpdatePouringOutItemReq();
      item.ProductionHeadCode = element.ProductionHeadCode;
      item.ProductionCode = element.ProductionCode;
      item.POU_PouringOutItem_ID = element.POU_PouringOutItem_ID;
      item.PouringTemp = element.PouringTemp;
      item.PouringTime = element.PouringTime;
      item.Quantity = element.Quantity;
      item.RecordNumber = element.RecordNumber;
      item.ItemNumber = element.ItemNumber;
      item.PouringOutWeight = element.PouringOutWeight;
      item.Weight = element.Weight;
      item.Basin = element.Basin;
      req.UpdatePouringOutItemReqs.push(item);
    });
    this.choosedFurnaceList.forEach(element => {
      let mat: PouringOutMaterialRep = new PouringOutMaterialRep();
      mat.POU_PouringData_ID = element.POU_PouringData_ID;
      mat.POU_PouringOutMaterial_ID = element.POU_PouringOutMaterial_ID;
      mat.TotalWeight = element.TotalWeight;
      req.UpdatePouringOutMaterialReqs.push(mat);
    })
    this.spinnerService.show();
    if (confirm("是否確定要更新？")) {
      this.rest.API_Update_UpdatePouringOutRecord(req, this.session.retrieve(LoginSessionEnum.UserAccount))
        .then((result) => {
          if (result['WorkStatus'] == "Fail") {
            alert(result['ErrorMsg']);
            this.spinnerService.hide();
            return;
          }
          if (result['WorkStatus'] == "OK") {
            this.rest.API_Query_SinglePouringOutRecordDetail(result['POU_PouringOutRecord_ID']).then(
              (data) => {
                this.Model = new SinglePouringOutRecordDetailModel();
                this.Model.POU_PouringOutRecord_ID = result['POU_PouringOutRecord_ID'];
                this.Model.Creator = data['Creator'];
                this.Model.Date = data['Date'];
                this.Model.Remaining = data['Remaining'];
                this.Model.TotalPouringOutWeight = data['TotalPouringOutWeight'];
                data['PouringOutItemRecordReps'].forEach((element: PouringOutItemRecordRep) => {
                  this.Model.PouringOutItemRecordReps.push(element);
                });
                data['PouringOutMaterialReps'].forEach((element: PouringOutMaterialRep) => {
                  this.Model.PouringOutMaterialReps.push(element);
                });
                alert("更新完成");
                this.spinnerService.hide();
              }, () => {
                alert("更新失敗");
                this.spinnerService.hide();
              });
          }

        },
          (err) => {
            this.spinnerService.show();
            console.log(err);
            alert("更新錯誤，請重新操作");
          }
        );
    }

  }
  /* #endregion */


  /* #region UI操作 */

  backPage() {
    this.router.navigate(['login_success/ProductManager']);
  }

  onStartDateSelect(selectdate: any) {
    this.selectedOutProduce = new PouringOutItemRep();
    this.FurnaceNumber = [];
    let value: Date = selectdate.value;
    this.sdate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();
    let datestring: string = yyyymmdd(value);

    this.rest.API_Query_PouringDataWeightList2(datestring, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (result: PouringDataWeightListModel) => {
        this.selectDateFuranceWorkList = result;
        this.selectDateFuranceWorkList.PouringDataWeightReps.forEach(element => {
          if (this.FurnaceNumber.find(f => f === element.PouringContainer) != element.PouringContainer) {
            this.FurnaceNumber.push(element.PouringContainer);
          }
        });
        this.selectedFurnaceCount = "default";
        this.selectedFurnaceNumber = "default";
        this.queryItemList(value);
      },
      () => {
        this.selectedFurnaceCount = "default";
        this.selectedFurnaceNumber = "default";
      }
    )
  }

  onselectedFurnaceNumberChange() {
    this.FurnaceCount = new Array<string>();
    this.selectedFurnaceCount = "";
    this.selectDateFuranceWorkList.PouringDataWeightReps.forEach(element => {
      if (element.PouringContainer == this.selectedFurnaceNumber) {
        this.FurnaceCount.push(element.PouringBatch);
      }
    });
    this.FurnaceCount = this.FurnaceCount.sort((n1, n2) => {
      if (Number.parseInt(n1) > Number.parseInt(n1)) {
        return 1;
      }
      if (Number.parseInt(n1) < Number.parseInt(n2)) {
        return -1;
      }
      return 0;
    });
  }

  onselectedFurnaceCountChange() {
    this.selectDateFuranceWorkList.PouringDataWeightReps.forEach(element => {
      if (element.PouringContainer == this.selectedFurnaceNumber && element.PouringBatch == this.selectedFurnaceCount) {
        this.selectedFuranceWork = element;
      }
    });
    this.TotalWeight = Number(this.selectedFuranceWork.MaterialTotalWeight);
    if (this.selectedFuranceWork.SetByUser == 1) {
      alert("此爐次重複登入");
    }
  }

  chooseFurnaceWork() {
    if (this.selectedFuranceWork.POU_PouringData_ID == undefined) {
      return;
    }

    let item: PouringOutMaterialReq = new PouringOutMaterialReq();
    item.PouringMaterialReps = this.selectedFuranceWork.PouringMaterialReps;
    item.TotalWeight = (Number(this.selectedFuranceWork.MaterialTotalWeight)).toString();
    item.PDID = this.selectedFuranceWork.PDID;
    item.PouringContainer = this.selectedFuranceWork.PouringContainer;
    item.PouringBatch = this.selectedFuranceWork.PouringBatch;
    item.POU_PouringData_ID = this.selectedFuranceWork.POU_PouringData_ID;

    if (this.choosedFurnaceList.length > 0) {
      if (this.choosedFurnaceList.find(x => x.PDID == item.PDID) === undefined) {
        this.choosedFurnaceList.push(item);
      }
    }
    else {

      this.choosedFurnaceList.push(item);
    }
    this.caculate();
  }

  deChooseFurnaceWork(item: PouringOutMaterialReq) {
    this.choosedFurnaceList = this.choosedFurnaceList.filter(function (param) {
      return param.POU_PouringData_ID != item.POU_PouringData_ID;
    })
    this.caculate();
  }

  onselectedOutProduce(item: number) {
    this.selectedOutProduce = this.ProductList.filter(x => x.id == item)[0];
    this.selectProductName = this.selectedOutProduce.ItemNumber;
    this.MOQTY = this.selectedOutProduce.MOQTY;
    this.Production_Weight = parseFloat(this.selectedOutProduce.Weight);
  }

  caculate() {
    /**餘重 */
    this.TotalWeight_Remaining = 0;
    /**所選爐次總重 */
    this.allSelectFurnaceTotlWeight = 0;
    /**出水總重 */
    this.TotalWeight_Out = 0;

    this.choosedFurnaceList.forEach((f) => this.allSelectFurnaceTotlWeight += Number(f.TotalWeight));

    let CompareOldBasin: Array<string> = new Array<string>();
    this.ProduceOutList.forEach((f) => {
      if (CompareOldBasin.find(o => o == f.Basin) == undefined) {
        this.TotalWeight_Out += Number(f.PouringOutWeight)
        CompareOldBasin.push(f.Basin);
      }
    });
    this.TotalWeight_Remaining = this.allSelectFurnaceTotlWeight - this.TotalWeight_Out;
    this.TotalWeight_Remaining < 0 ? this.TotalWeight_Remaining = 0 : this.TotalWeight_Out = this.TotalWeight_Out;


  }

  addProductToList() {
    if (this.selectedOutProduce.ProductionCode != undefined) {
      let item: PouringOutItemReq = new PouringOutItemReq();
      item.ProductionHeadCode = this.selectedOutProduce.ProductionHeadCode;
      item.ProductionCode = this.selectedOutProduce.ProductionCode;
      item.ItemNumber = this.selectedOutProduce.ItemNumber;
      item.Weight = Number(this.Production_Weight).toFixed(0);
      item.Quantity = this.CastingCount.toString();
      item.PouringTemp = this.CastingTemp.toString();
      item.PouringTime = this.CastingTime.toString();
      item.PouringOutWeight = this.customOutWeight.toString();
      item.Basin = this.BasinCounter.toString();
      item.ViewIndex = String(this.ProduceOutList.length + 1)
      if (item.Basin == '0') {
        alert('未輸入爐次');
        return;
      }
      if (this.customOutWeight == 0) {
        alert('出水總重錯誤');
        return;
      }

      if (this.ProduceOutList.find(p => p.Basin === item.Basin) !== undefined) {
        let oldp = this.ProduceOutList.find(p => p.Basin === item.Basin);
        if (oldp.PouringOutWeight !== item.PouringOutWeight) {
          alert("相同盆次不可更改出水總重");
          this.customOutWeight = Number(oldp.PouringOutWeight);
          return;
        }
        if (this.ProduceOutList.find(p => p.ItemNumber === this.selectedOutProduce.ItemNumber) !== undefined) {
          let pr: PouringOutItemReq = this.ProduceOutList.find(p => p.ItemNumber === this.selectedOutProduce.ItemNumber);
          if (!confirm("本紀錄已有相同產品在第" + pr.Basin + "盆，產品號碼" + pr.ItemNumber + "確定要新增嗎？")) {
            return;
          }
        }
        this.ProduceOutList.push(item);
      }
      else {
        if (this.TotalWeight_Remaining < Number(item.PouringOutWeight)) { return; }
        this.ProduceOutList.push(item);
      }
    }
    this.caculate();
  }

  removeProductFromList(item: PouringOutItemReq) {
    this.ProduceOutList = this.ProduceOutList.filter(f => f.ViewIndex != item.ViewIndex);
    this.caculate();
  }

  resetProductData() {
    console.log(this.selectedOutProduce);
    this.CastingCount = 0;
    this.selectedOutProduce.Weight = "0";
    this.CastingTemp = 0;
    this.CastingTime = '';
  }
  CheckCastingCount() {
    var sumqty = this.ProduceOutList.filter(x => x.ProductionHeadCode == this.selectedOutProduce.ProductionHeadCode && x.ProductionCode == this.selectedOutProduce.ProductionCode).length > 0 ? (this.ProduceOutList.filter(x => x.ProductionHeadCode == this.selectedOutProduce.ProductionHeadCode && x.ProductionCode == this.selectedOutProduce.ProductionCode).map(x => Number(x.Quantity)).reduce((a, b) => a + b)) : 0;
    if (this.MOQTY < (this.CastingCount + sumqty)) {
      return { 'color': 'red' }
    }
    else {
      return { 'color': 'black' }
    }
  }
  CheckCastingCount2() {
    var sumqty = this.ProduceOutList.filter(x => x.ProductionHeadCode == this.selectedOutProduce.ProductionHeadCode && x.ProductionCode == this.selectedOutProduce.ProductionCode).length > 0 ? (this.ProduceOutList.filter(x => x.ProductionHeadCode == this.selectedOutProduce.ProductionHeadCode && x.ProductionCode == this.selectedOutProduce.ProductionCode).map(x => Number(x.Quantity)).reduce((a, b) => a + b)) : 0;
    if (this.MOQTY >= (this.CastingCount + sumqty)) {
      return true
    }
    else {
      return false
    }
  }
  CheckCastingCount3() {
    var sumqty = this.ProduceOutList.filter(x => x.ProductionHeadCode == this.selectedOutProduce.ProductionHeadCode && x.ProductionCode == this.selectedOutProduce.ProductionCode).length > 0 ? (this.ProduceOutList.filter(x => x.ProductionHeadCode == this.selectedOutProduce.ProductionHeadCode && x.ProductionCode == this.selectedOutProduce.ProductionCode).map(x => Number(x.Quantity)).reduce((a, b) => a + b)) : 0;
    return this.CastingCount + sumqty
  }

  /* #endregion */

}

function yyyymmdd(value: Date) {
  var y = value.getFullYear().toString();

  var m = (value.getMonth() + 1).toString();
  var d = value.getDate().toString();
  (d.length == 1) && (d = '0' + d);
  (m.length == 1) && (m = '0' + m);
  var yyyymmdd = y + m + d;
  return yyyymmdd;
}


