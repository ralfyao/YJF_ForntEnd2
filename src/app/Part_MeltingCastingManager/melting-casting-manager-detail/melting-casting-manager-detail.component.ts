import { Component, OnInit, Injector, Input, Inject } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PermissionService } from 'src/app/Service/permission.service';
import { Model_SinglePouringDataDetail, Model_PouringMaterial, Model_AddPouringData_Response } from 'src/app/Model/PouringData';
import { PouringDataService } from 'src/app/Service/PouringData.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomRegexPattern, CustomValidateService } from 'src/app/Service/custom-validate.service';
import { SinglePermissionPerson } from 'src/app/Model/vo';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { MaterialListReq } from 'src/app/Model/ParamaterSetting';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateAdapter } from '@angular/material/core';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'

@Component({
  selector: 'app-melting-casting-manager-detail',
  templateUrl: './melting-casting-manager-detail.component.html',
  styleUrls: ['./melting-casting-manager-detail.component.css'],
  providers: [PouringDataService]
})

export class MeltingCastingManagerDetailComponent implements OnInit {

  //#region 正則表達式
  /**個位數兩位數與小數點兩位(11.11)
   * @type {string}
   * @memberof MeltingCastingManagerDetailComponent
   */
  Regular_NumberDotNumber_Pattern: string = CustomRegexPattern.BigNumberDot5Number;
  Regular_NumberDotNumber_Title: string = "只可以輸入數字，小數點最多2位數，個位數最多2位數。";

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

  form: FormGroup;

  /**單筆紀錄Model
   * @type {Model_SinglePouringDataDetail}
   * @memberof MeltingCastingManagerDetailComponent
   */
  @Input() Model: Model_SinglePouringDataDetail;
  public LoginUserPermission: Array<SinglePermissionPerson> = this.session.retrieve(LoginSessionEnum.Permission);
  public LoginUserAccount: string = this.session.retrieve(LoginSessionEnum.UserAccount);
  /**存放目前的登入者名稱
 * @type {string}
 * @memberof CustomerListComponent
 */
  public LoginUserName: string = this.session.retrieve(LoginSessionEnum.Name);

  /**材料配比(來源)
   * @type {Array<string>}
   * @memberof MeltingCastingManagerDetailComponent
   */
  SourceMaterialDataList: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>();

  /**材料配比(已選擇)
   * @type {Array<string>}
   * @memberof MeltingCastingManagerDetailComponent
   */
  ChooseMaterialDataList: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>();

  TotalWeight: string = "0";
  materialTypes: Array<string> = new Array<string>("FC300", "FCD450", "FCD500");
  PouringContainerNames: Array<string> = new Array<string>("A", "B", "F");
  selectedmaterialType: string = "";
  /* #region 預設日期時間 */
  SelectDate: string = new Date().toLocaleDateString('en-CA');
  settings = {
    format: 'yyyy-MM-dd'
  }
  StartTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
  EndTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
  /* #endregion */
  //各材質標準用量比例
  StandardMateriaList: Array<any> = [];
  TotalStandardWeight: number = 0;

  constructor(
    @Inject(DOCUMENT) public document,
    private inj: Injector,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private rest: PouringDataService,
    private formBuilder: FormBuilder,
    private sweetAlertService: SweetAlertService,
    private _adapter: DateAdapter<any>,
    private crypt: CustomValidateService) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['Melting']);
      if (data == undefined) {
        this.Model = new Model_SinglePouringDataDetail();
      }
      else {
        this.Model = JSON.parse(data);
      }
    });
  }

  ngOnInit() {
    this._adapter.setLocale('zh-tw');
    if (this.Model.MaterialType !== "") {
      this.loadMaterial(this.Model.MaterialType);
    }
    if (this.Model.PDID != "") {
      this.StartTime = this.Model.StartTime;
      this.EndTime = this.Model.EndTime;//20190322
      this.SelectDate =
        this.Model['Date'].toString().substr(0, 4) + '-' +
        this.Model['Date'].toString().substr(4, 2) + '-' +
        this.Model['Date'].toString().substr(6, 2);

    }
    this.caculateWeight();
    this.form = this.formBuilder.group({
      LoginUserName: [this.LoginUserName, Validators.required],
      MaterialType: [this.Model.MaterialType, Validators.required],
      PouringContainer: [this.Model.PouringContainer, Validators.required],
      PouringTemp: [this.Model.PouringTemp, Validators.required],
      StartTime: [this.StartTime, Validators.required],
      EndTime: [this.EndTime, Validators.required],
      CE: [this.Model.CE, Validators.required],
      Wedge1: [this.Model.Wedge1, Validators.required],
      Wedge2: [this.Model.Wedge2, Validators.required],
      CEC: [this.Model.CEC, Validators.required],
      CESi: [this.Model.CESi, Validators.required],
      B_C: [this.Model.B_C, Validators.required],
      B_Si: [this.Model.B_Si, Validators.required],
      B_Mn: [this.Model.B_Mn, Validators.required],
      B_P: [this.Model.B_P, Validators.required],
      B_S: [this.Model.B_S, Validators.required],
      B_Cu: [this.Model.B_Cu, Validators.required],
      B_Sn: [this.Model.B_Sn, Validators.required],
      B_Ti: [this.Model.B_Ti, Validators.required],
      B_Cr: [this.Model.B_Cr, Validators.required],
      B_Mg: [this.Model.B_Mg, Validators.required],
      A_C: [this.Model.A_C, Validators.required],
      A_Si: [this.Model.A_Si, Validators.required],
      A_Mn: [this.Model.A_Mn, Validators.required],
      A_P: [this.Model.A_P, Validators.required],
      A_S: [this.Model.A_S, Validators.required],
      A_Cu: [this.Model.A_Cu, Validators.required],
      A_Sn: [this.Model.A_Sn, Validators.required],
      A_Ti: [this.Model.A_Ti, Validators.required],
      A_Cr: [this.Model.A_Cr, Validators.required],
      A_Mg: [this.Model.A_Mg, Validators.required]
    });
    if ((this.premanager.GetPermission(this.LoginUserPermission, 'PouringData', 'IsCanEdit', this.LoginUserAccount) == false)) {
      this.form.disable({
        onlySelf: false
      }
      );
    }
  }

  // /* #region 時間UI功能 */
  // startTimerOpen() {
  //   const amazingTimePicker = this.atp.open({
  //     time: this.StartTime,
  //     theme: 'material-blue',
  //     animation: 'rotate',
  //   });
  //   amazingTimePicker.afterClose().subscribe(time => {
  //     this.StartTime = time;
  //   });
  // }

  // endTimerOpen() {
  //   const amazingTimePicker = this.atp.open({
  //     time: this.EndTime,
  //     theme: 'material-blue',
  //     animation: 'rotate'
  //   });
  //   amazingTimePicker.afterClose().subscribe(time => {
  //     this.EndTime = time;
  //   });
  // }
  // /* #endregion */

  backPage() {
    this.router.navigate(['login_success/MeltingCastingManager'], { queryParams: { data: null } });
  }

  addMeltLog() {
    if (this.form.valid) {
      this.Model.EngName = this.LoginUserName;
      this.Model.PouringMaterialReps = this.ChooseMaterialDataList.filter(x => parseInt(x.MaterialWeight) > 0);
      this.Model.StartTime = this.StartTime;
      this.Model.EndTime = this.EndTime;
      this.Model.IsReturnToZero = "0";
      this.Model.date_id = this.SelectDate;

      if (this.Model.PouringMaterialReps.length == 0) {
        this.sweetAlertService.alertFail({
          text: "未輸入材料數量!!"
        })
        return;
      }
      let warningMessage: string = "";
      let TotalMaterialWeight = this.caculateWeight();
      this.Model.PouringMaterialReps.forEach(element => {
        var standarditem = this.StandardMateriaList.filter(f => f.MaterialNo == element.MaterialNo);
        if (standarditem.length > 0 && standarditem[0].MaterialWeight != 0) {

          let StandardWeight = standarditem[0].MaterialWeight / 100 * 10500;
          if ((StandardWeight * 1.1 < parseInt(element.MaterialWeight) || StandardWeight * 0.9 > parseInt(element.MaterialWeight))) {
            warningMessage += element.MaterialName + "(實際/標準) : " + element.MaterialWeight + "/" + Math.round(StandardWeight * 0.9 * 100) / 100 + "~" + Math.round(StandardWeight * 1.1 * 100) / 100 + "\r\n";
          }
        }
      });

      if (warningMessage.length > 0) {
        this.sweetAlertService.confirm({
          title: '重量異常是否繼續?',
          text: warningMessage,
          icon: 'warning'
        }).then((data) => {
          if (data.isConfirmed) {
            this.DoAddMeltLog()
          }
        })
      } else {
        this.DoAddMeltLog()
      }
    }
  }
  DoAddMeltLog() {
    this.spinnerService.show();
    if (confirm("此次是否有進行保養？如果沒有請按取消。")) {
      this.Model.IsReturnToZero = "1";
    }
    else {
      this.Model.IsReturnToZero = "0";
    }
    this.rest.API_Insert_PouringData(this.Model, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (result: Model_AddPouringData_Response) => {
        this.rest.API_Query_SinglePouringData(result.POU_PouringData_ID).then(
          (data) => {
            alert("完成新增");
            this.Model = data;
            this.StartTime = this.Model.StartTime;
            this.EndTime = this.Model.EndTime;
            this.ChooseMaterialDataList = this.Model.PouringMaterialReps;
          }, () => {
            alert("發生錯誤");
          });
        this.spinnerService.hide();
      },
      () => { }
    )
  }

  updateMeltLog() {
    if (this.form.valid) {
      this.spinnerService.show();
      if (confirm("此次是否有進行保養？如果沒有請按取消。")) {
        this.Model.IsReturnToZero = "1";
      }
      else {
        this.Model.IsReturnToZero = "0";
      }
      this.Model.PouringMaterialReps = this.ChooseMaterialDataList.filter(x => parseInt(x.MaterialWeight) > 0);
      this.rest.API_Update_PouringData(this.Model, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
        (data) => {
          alert("完成更新");
          this.spinnerService.hide();
        }
        ,
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.spinnerService.hide();
          console.log(error);
        }
      )
    }
  }

  deleteMeltLog() {
    if (confirm("是否要刪除這筆資料？")) {
      this.spinnerService.show();
      this.rest.API_Delete_PouringData(this.Model.POU_PouringData_ID, this.session.retrieve(LoginSessionEnum.UserAccount)).then(
        (data) => {
          alert("資料已刪除");
          this.Model = new Model_SinglePouringDataDetail;
          this.StartTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
          this.EndTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
          this.ChooseMaterialDataList = new Array<Model_PouringMaterial>();
          this.spinnerService.hide();
        }
        ,
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.spinnerService.hide();
          console.log(error);
        }
      )
    }
  }
  DateString() {
    return new Date(Date.now()).toDateString();
  }

  loadMaterial(materialType: string) {
    this.spinnerService.show();
    let req: MaterialListReq = new MaterialListReq();
    req.MaterialType = this.Model.MaterialType;
    this.GetStandardMaterial();
    this.rest.API_Query_PouringMaterialList(req).then(
      (data) => {
        this.SourceMaterialDataList = data;
        this.SourceMaterialDataList = this.SourceMaterialDataList.filter(
          function (item, index, array) {
            return item.MaterialType.trim() === materialType;
          }
        );
        if (this.Model.PDID != '') {
          this.ChooseMaterialDataList = this.SourceMaterialDataList;
          this.Model.PouringMaterialReps.forEach(x => {
            this.ChooseMaterialDataList.filter(y => y.MaterialNo == x.MaterialNo)[0].MaterialWeight = x.MaterialWeight;
          });
        } else {
          this.ChooseMaterialDataList = this.SourceMaterialDataList;
        }

        this.spinnerService.hide();
      },
      () => {
        this.spinnerService.hide();
      })
  }

  materialTypeChange(value: string) {
    this.Model.MaterialType = value;
    this.loadMaterial(this.Model.MaterialType);

  }

  pouringContainerChange(value: string) {
    this.Model.PouringContainer = value;
  }

  //獲取標準用量(存檔前警示用)
  GetStandardMaterial() {
    this.rest.API_GetStandardMaterial(this.Model.MaterialType).then((data) => {
      this.StandardMateriaList = data["StandardList"];
      this.TotalStandardWeight = data["TotalStandardWeight"];
    })
  }

  chooseMaterial(value: Model_PouringMaterial) {
    this.ChooseMaterialDataList.push(value);
    this.SourceMaterialDataList = this.SourceMaterialDataList.filter(function (param) {
      return param.MaterialNo != value.MaterialNo;
    })
    return this.ChooseMaterialDataList;
  }

  dechooseMaterial(value: Model_PouringMaterial) {
    value.MaterialWeight = "0";
    this.SourceMaterialDataList.push(value);
    this.ChooseMaterialDataList = this.ChooseMaterialDataList.filter(function (param) {
      return param.MaterialNo != value.MaterialNo;
    })
    this.SourceMaterialDataList = this.SourceMaterialDataList.sort((n1, n2) => {
      if (Number.parseInt(n1.MaterialNo) > Number.parseInt(n2.MaterialNo)) {
        return 1;
      }
      if (Number.parseInt(n1.MaterialNo) < Number.parseInt(n2.MaterialNo)) {
        return -1;
      }
      return 0;
    }
    );
    return this.SourceMaterialDataList;
  }

  caculateWeight() {
    this.TotalWeight = "0";
    this.ChooseMaterialDataList.forEach(x => {
      if (isNaN(parseInt(x.MaterialWeight))) {
        x.MaterialWeight = '0';
      }
    });
    for (let index = 0; index < this.ChooseMaterialDataList.length; index++) {
      this.TotalWeight = (parseInt(this.TotalWeight) + parseInt(this.ChooseMaterialDataList[index].MaterialWeight)).toString();
    }
    return this.TotalWeight;
  }

  checkvalue(value: string, index: number) {
    if (isNaN(parseInt(value))) {
      this.ChooseMaterialDataList[index].MaterialWeight = '0';
    }
  }
  CheckMaterialCount() {
    let clientwidth = (this.document.getElementById('MaterialTable').clientWidth + 17) / Math.floor((this.document.getElementById('MaterialTable').clientWidth + 17) / 200);
    return clientwidth + 'px';
    // if (this.MOQTY < (this.CastingCount+sumqty)) {
    //   return { 'color': 'red' }
    // }
    // else {
    //   return { 'color': 'black' }
    // }
  }

  tracktest(intex: any, item: any) {
    return item;
  }

  TempChange(value: any) {
  }


}
