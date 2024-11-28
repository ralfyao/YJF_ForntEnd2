import { Component, OnInit, Injector, Inject } from '@angular/core';
import { PermissionService } from 'src/app/Service/permission.service';
import { SessionStorageService } from 'ngx-webstorage';
import { PouringProductService } from 'src/app/Service/pouring-product.service';
import { PouringOutRecordListReq, PouringOutRecordModel, PouringOutRecordListModel, SinglePouringOutRecordDetailModel, PouringOutItemRecordRep, PouringOutMaterialRep } from 'src/app/Model/PouringoutData';
import { Router } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css'],
  providers: [PouringProductService]
})
export class ProductManagerComponent implements OnInit {
  //#region 列表翻頁的參數跟API抓取參數
  /**
   * @private
   * @type {number}
   * @memberof MeltingCastingManagerComponent
   */
  public PageCount: number = 12;
  public TotalCount: number = 0;
  public Page: number = 1;
  //#endregion

  //#region 搜尋參數
  sdate: string;
  edate: string;
  StartDate: Date = new Date(new Date().getTime() - (7 * 24 * 3600000));
  EndDate: Date = new Date();
  settings = {
    bigBanner: true,
    timePicker: false,
    format: 'yyyy-MM-dd',
    defaultOpen: false
  }
  SearchText:string="";
  public LogNumber: string = "";
  public LogMan: string = "";
  public ForeNumber: string = "";
  //#endregion

  /* #region UI資料 */

  public recordList: Array<PouringOutRecordModel> = new Array<PouringOutRecordModel>();
  public LoginUserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);

  /* #endregion UI資料*/

  constructor(
    @Inject(DOCUMENT) private document,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private rest: PouringProductService,
    private router: Router,
    private crypt: CustomValidateService) { }

  ngOnInit() {
    this.sdate = new Date(new Date().getTime() - (7 * 24 * 3600000)).getFullYear().toString() + "/" + (new Date(new Date().getTime() - (7 * 24 * 3600000)).getMonth() + 1).toString() + "/" + new Date(new Date().getTime() - (7 * 24 * 3600000)).getDate().toString();
    this.edate = new Date().getFullYear().toString() + "/" + (new Date().getMonth() + 1).toString() + "/" + new Date().getDate().toString();
    this.SmartSearch(1,'');
  }

  SmartSearch(Page:number,SearchText:string){
    this.spinnerService.show();
    this.rest.API_SmartSearchPouringOutRecordList(this.session.retrieve(LoginSessionEnum.UserAccount),SearchText,Page,this.PageCount).then(
      (list: PouringOutRecordListModel) => {
        this.recordList = list.PouringOutRecordModels;
        this.TotalCount = Number(list.TotalCount);
        this.spinnerService.hide();
      },
      (error) => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }
  TableRowColorChange(tablename:string,List:any,row:number){
    var i = 0;
    List.forEach(x=>{
      this.document.getElementById(tablename+i.toString()).setAttribute('style', '');
      i++
    });
    this.document.getElementById(tablename+row.toString()).setAttribute('style', 'background-color:deepskyblue;');
  }

  queryRecoreList() {
    let req: PouringOutRecordListReq = new PouringOutRecordListReq();
    req.Creator = this.LogMan;
    req.StartCreateDate = this.sdate;
    req.EndCreateDate = this.edate;
    this.rest.API_Query_PouringOutRecordList(req, this.PageCount.toString(), this.Page.toString()).then(
      (list: PouringOutRecordListModel) => {
        this.recordList = list.PouringOutRecordModels;
        this.TotalCount = Number(list.TotalCount);
      },
      () => { }
    )
  }

  loadPage(page: any) {
    this.Page = page;
    this.SmartSearch(page,this.SearchText);
  }

  addProductLog(value: PouringOutRecordModel) {
    if (value != null && value != undefined) {
      this.spinnerService.show();
      this.rest.API_Query_SinglePouringOutRecordDetail(value.POU_PouringOutRecord_ID).then(
        (data) => {
          let Model: SinglePouringOutRecordDetailModel = new SinglePouringOutRecordDetailModel();
          Model.POU_PouringOutRecord_ID = value.POU_PouringOutRecord_ID;
          Model.Creator = data['Creator'];
          Model.Date = data['Date'];
          Model.Remaining = data['Remaining'];
          Model.TotalPouringOutWeight = data['TotalPouringOutWeight'];
          data['PouringOutItemRecordReps'].forEach((element: PouringOutItemRecordRep) => {
            Model.PouringOutItemRecordReps.push(element);
          });
          data['PouringOutMaterialReps'].forEach((element: PouringOutMaterialRep) => {
            Model.PouringOutMaterialReps.push(element);
          });
          this.spinnerService.hide();
          let s: string = JSON.stringify(Model);
          this.router.navigate(['login_success/ProductManagerDetail'], { queryParams: { data: this.crypt.AESEncrypt(s) } });
        }, () => {
          this.spinnerService.hide();
        })
    }
    else {
      this.router.navigate(['login_success/ProductManagerDetail'], { queryParams: { data: null } });
    }
  }

  onStartDateSelect(value: Date) {
    this.sdate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();

  }
  onEndDateSelect(value: Date) {
    this.edate = value.getFullYear().toString() + "/" + (value.getMonth() + 1).toString() + "/" + value.getDate().toString();
  }
}
