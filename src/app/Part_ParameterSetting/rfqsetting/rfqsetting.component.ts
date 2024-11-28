import { Component, OnInit } from '@angular/core';
import { QuoteTypeRep, AddQuoteTypeReq, UpdateQuoteType } from 'src/app/Model/ParamaterSetting';
import { ParameterSettingService } from 'src/app/Service/parameter-setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rfqsetting',
  templateUrl: './rfqsetting.component.html',
  styleUrls: ['./rfqsetting.component.css'],
  providers: [ParameterSettingService]
})
export class RFQSettingComponent implements OnInit {

  /* #region  分頁器 */
  public PageCount: number = 10;
  public TotalCount: number = 0;
  public Page: number = 1;
  /* #endregion */

  /*搜尋參數 */
  public searchString = "";

  /*列表資料*/
  public QuoteTypeList: Array<QuoteTypeRep> = new Array<QuoteTypeRep>();
  public QuoteTypeListByFilter: Array<QuoteTypeRep> = new Array<QuoteTypeRep>();

  /*案修改的資料*/
  public selectedQuoteType: QuoteTypeRep = new QuoteTypeRep(this.session);

  /*要新增的資料*/
  public newQuoteType: QuoteTypeRep = new QuoteTypeRep(this.session);

  constructor(private spinnerService: NgxSpinnerService,
    private rest: ParameterSettingService,
    private session: SessionStorageService) { }

  ngOnInit() {
    this.loadQuoteTypeList();
  }

  loadQuoteTypeList() {
    this.spinnerService.show();
    this.rest.API_Query_QuoteTypeList(this.PageCount.toString(), this.Page.toString()).then(
      (data) => {
        this.QuoteTypeList = data.QuoteTypeReps;
        this.TotalCount = Number(data.TotalCount);
        this.spinnerService.hide();
        this.searchQuotypeName();
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
    this.loadQuoteTypeList();
  }

  selectUpdateQuoteType(item: QuoteTypeRep) {
    this.selectedQuoteType = item;
  }

  UpdateQuoteType() {
    let newUpdateQuoteType: UpdateQuoteType = new UpdateQuoteType(this.session)
    newUpdateQuoteType.SYS_QuoteType_ID = this.selectedQuoteType.SYS_QuoteType_ID;
    newUpdateQuoteType.QuoteTypeName = this.selectedQuoteType.QuoteTypeName;
    newUpdateQuoteType.Representative = this.selectedQuoteType.Representative;
    newUpdateQuoteType.PartNo = this.selectedQuoteType.PartNo;
    this.spinnerService.show();
    this.rest.API_Update_QuoteType(newUpdateQuoteType).then(
      (data) => {
        if (data['WorkStatus'] == 'OK') {
          this.spinnerService.hide();
          alert("修改完成");
          this.loadQuoteTypeList();
        } else {
          this.spinnerService.hide();
          alert("發生錯誤：" + data['ErrorMsg']);
          this.loadQuoteTypeList();
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }

  selectDeleteQuoteType(item: QuoteTypeRep) {
    this.selectedQuoteType = item;
  }

  DeleteQuoteType(item: QuoteTypeRep) {
    let deleteQuoteType: UpdateQuoteType = new UpdateQuoteType(this.session);
    deleteQuoteType.QuoteTypeName = item.QuoteTypeName;
    deleteQuoteType.SYS_QuoteType_ID = item.SYS_QuoteType_ID;
    this.spinnerService.show();

    this.rest.API_Delete_QuoteType(deleteQuoteType).then(
      (data) => {
        if (data['WorkStatus'] == 'OK') {
          this.spinnerService.hide();
          alert("刪除完成");
          this.loadQuoteTypeList();
        } else {
          this.spinnerService.hide();
          alert("發生錯誤：" + data['ErrorMsg']);
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }

  selectnewQuoteType() {
    this.newQuoteType = new QuoteTypeRep(this.session);
  }

  addQuoteType() {
    let newAddQuoteType: AddQuoteTypeReq = new AddQuoteTypeReq(this.session);
    newAddQuoteType.QuoteTypeName = this.newQuoteType.QuoteTypeName;
    newAddQuoteType.Representative = this.newQuoteType.Representative;
    newAddQuoteType.PartNo = this.newQuoteType.PartNo;
    this.spinnerService.show();
    this.rest.API_Insert_QuoteType(newAddQuoteType).then(
      (data) => {
        if (data['WorkStatus'] == 'OK') {
          this.spinnerService.hide();
          alert("新增完成");
          this.loadQuoteTypeList();
        } else {
          this.spinnerService.hide();
          alert("發生錯誤：" + data['ErrorMsg']);
        }

      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        alert("發生錯誤：" + err.message);
      }
    )
  }
  searchQuotypeName() {
    this.QuoteTypeListByFilter = new Array<QuoteTypeRep>();
    if (this.searchString.length !== 0) {
      this.QuoteTypeListByFilter = this.QuoteTypeList
        .filter(x => x.QuoteTypeName.includes(this.searchString.trim()) ||
          x.Representative.includes(this.searchString.trim()) ||
          x.PartNo.includes(this.searchString.trim()))
        .sort();
    } else {
      this.QuoteTypeListByFilter = this.QuoteTypeList;
    }
  }

}
