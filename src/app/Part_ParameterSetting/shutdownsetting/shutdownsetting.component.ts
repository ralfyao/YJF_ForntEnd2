import { Component, OnInit } from '@angular/core';
import { ShutDownRep, AddShutDownReq, UpdateShutDown } from 'src/app/Model/ParamaterSetting';
import { ParameterSettingService } from 'src/app/Service/parameter-setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shutdownsetting',
  templateUrl: './shutdownsetting.component.html',
  styleUrls: ['./shutdownsetting.component.css']
})
export class ShutdownsettingComponent implements OnInit {

  /* #region  分頁器 */
  public PageCount: number = 10;
  public TotalCount: number = 0;
  public Page: number = 1;
  /* #endregion */

  /*搜尋參數 */
  public searchString = "";

  /*列表資料*/
  public ShutDownList: Array<ShutDownRep> = new Array<ShutDownRep>();
  public ShutDownListByFilter: Array<ShutDownRep> = new Array<ShutDownRep>();
  /*要修改的資料*/
  public selectedShutName: ShutDownRep = new ShutDownRep(this.session);

  /*要新增的資料*/
  public newShutDown: ShutDownRep = new ShutDownRep(this.session);

  constructor(private spinnerService: NgxSpinnerService,
    private rest: ParameterSettingService,
    private session: SessionStorageService) { }

  ngOnInit(): void {
    this.loadShutDownList();
  }

  loadShutDownList() {
    this.spinnerService.show();
    this.rest.API_Query_ShutDownList(this.PageCount.toString(), this.Page.toString()).then(
      (data) => {
        this.ShutDownList = data.ShutDownRep;
        this.TotalCount = Number(data.TotalCount);
        this.spinnerService.hide();
        this.searchShutDownName();
      }
      ,
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }

  loadPage(Page: number) {
    this.Page = Page;
    this.loadShutDownList();
  }

  selectUpdateShutName(item: ShutDownRep) {
    this.selectedShutName = item;
  }

  UpdateShutName() {
    let newUpdateShutName: UpdateShutDown = new UpdateShutDown(this.session)
    newUpdateShutName.SYS_ShutDown_ID = this.selectedShutName.SYS_ShutDown_ID;
    newUpdateShutName.ShutDownName = this.selectedShutName.ShutDownName;
    newUpdateShutName.Representative = this.selectedShutName.Representative;
    this.spinnerService.show();
    this.rest.API_Update_ShutDown(newUpdateShutName).then(
      (data) => {
        this.spinnerService.hide();
        alert("修改完成");
        this.loadShutDownList();
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }

  searchShutDownName() {
    this.ShutDownListByFilter = new Array<ShutDownRep>();
    if (this.searchString.length !== 0) {
      this.ShutDownListByFilter = this.ShutDownList
        .filter(x => x.ShutDownName.includes(this.searchString.trim()) ||
          x.Representative.includes(this.searchString.trim()))
        .sort();
    } else {
      this.ShutDownListByFilter = this.ShutDownList;
    }
  }

  selectDeleteShutDown(item: ShutDownRep) {
    let deleteShutDown: UpdateShutDown = new UpdateShutDown(this.session);
    deleteShutDown.ShutDownName = item.ShutDownName;
    deleteShutDown.SYS_ShutDown_ID = item.SYS_ShutDown_ID;
    this.spinnerService.show();
    this.rest.API_Delete_ShutDown(deleteShutDown).then(
      (data) => {
        this.spinnerService.hide();
        alert("刪除完成");
        this.loadShutDownList();
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }

  selectnewShutDown() {
    this.newShutDown = new ShutDownRep(this.session);
  }

  addShutDown() {
    let newAddShutDown: AddShutDownReq = new AddShutDownReq(this.session);
    newAddShutDown.ShutDownName = this.newShutDown.ShutDownName;
    newAddShutDown.Representative = this.newShutDown.Representative;

    this.spinnerService.show();
    this.rest.API_Insert_ShutDown(newAddShutDown).then(
      (data) => {
        this.spinnerService.hide();
        alert("新增完成");
        this.loadShutDownList();
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }


}
