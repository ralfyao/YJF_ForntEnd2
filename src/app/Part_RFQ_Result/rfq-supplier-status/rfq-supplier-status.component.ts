import { Component, OnInit, Injector, Inject, ViewChild, ElementRef } from '@angular/core';
import { SupplierQuoteStatus, SupplierQuoteLog, QuotationDetail, QuotationDetailAnnexRep, SupplierQuotationRecord, QuoteFilterList, PageStatus } from 'src/app/Model/vo';
import { RFQService } from 'src/app/Service/rfq.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum, QuotationPageEnum } from 'src/app/Enum/session-enum.enum';
import { DOCUMENT } from "@angular/common";
import { HttpEventType } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { SmartSearchSupplierQuoteStatusListRequest } from 'src/bin/smartSearchSupplierQuoteStatusListRequest';
import { catchError, tap } from 'rxjs/operators';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service';
import { RFQAttachListRequest } from 'src/bin/rFQAttachListRequest';
import { QuerySingleQuotationDetailRequest } from 'src/bin/querySingleQuotationDetailRequest';
import { SupplierAttachAllListReqeust } from 'src/bin/supplierAttachAllListReqeust';
import { SingleSupplierQuoteLogListRequest } from 'src/bin/singleSupplierQuoteLogListRequest';
import { of } from 'rxjs';

export interface StatuList {
  Name: string;
  ID: number;
}
export interface GroupList {
  Name: string;
  GroupID: string;
}
export interface SortList {
  ColumnName: string;
  SortType: string;
  SortText: string;
  Order: number;
}


@Component({
  selector: 'app-rfq-supplier-status',
  templateUrl: './rfq-supplier-status.component.html',
  styleUrls: ['./rfq-supplier-status.component.css']
})
export class RFQSupplierStatusComponent implements OnInit {
  @ViewChild('tables') tables: ElementRef;
  Search_SupplierName: string;
  Search_QuoteItem: string;
  Search_CUSName: string;
  Search_QuoteNumber: string;
  AllDisplayViewUse:string[] = [
    '系統管理者',
    '黃獻毅',
    '張中議',
    '林幸慧',
    '鄭寬宏'
  ];
  SupplierQuoteStatusList: Array<SupplierQuoteStatus> = new Array<SupplierQuoteStatus>();
  AllSupplierQuoteStatusList: Array<SupplierQuoteStatus> = new Array<SupplierQuoteStatus>();
  SupplierQuoteStatus: SupplierQuoteStatus;
  Search_Statu: number = 2;
  TotalCount: number = 0;
  Page: number = 1;
  PageCount: number = 12;
  selectDetail: SupplierQuoteStatus = new SupplierQuoteStatus();
  QuotationDetail: QuotationDetail = new QuotationDetail();
  CurrentUserName = this.session.retrieve(LoginSessionEnum.Name);
  CanView: number = 0;
  SupplierAttachList: Array<QuotationDetailAnnexRep>;
  SupplierAttachLevelShow: Array<number>;
  newdetail: SupplierQuotationRecord = new SupplierQuotationRecord();
  SupplierAttach: QuotationDetailAnnexRep = new QuotationDetailAnnexRep();
  formData: FormData = new FormData();
  Uploaded: string = "0KB";
  UploadTotal: string = "0KB";
  ProgressPercent: number = 0;

  Search_Status: StatuList[] = [
    { Name: "全部", ID: 1 },
    { Name: "未結案", ID: 2 },
    { Name: "結案", ID: 3 }
  ];
  GroupColumns: GroupList[] = [
    { Name: "全部顯示", GroupID: "AllDisplay" },
    { Name: "供應商", GroupID: "SuppierDisplay" },
    { Name: "報價單號", GroupID: "QuoteDisplay" },
    { Name: "詢價客戶", GroupID: "CusDisplay" }
  ];
  groupselect: string = "SuppierDisplay";

  SortColumns: SortList[] = [
    { ColumnName: "QuoteDate", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "QuoteNumber", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "SupplierName", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "QuoteItemNumber", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "CUSID", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "Remark", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "QuoteTypeName", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "Status", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
    { ColumnName: "SalesName", SortType: "", SortText: "fa fa-arrows-v", Order: 0 }
  ];

  selectDetail_VendorList: Array<SupplierQuoteLog>;
  quotation_AttachList: any;
  SearchText: string = "";

  AllDisplay: boolean = false;
  SuppierDisplay: boolean = true;
  SuppierDisplayList: Array<QuoteFilterList> = new Array<QuoteFilterList>();

  QuoteDisplay: boolean = false;
  QuoteDisplayList: Array<QuoteFilterList> = new Array<QuoteFilterList>();

  CusDisplay: boolean = false;
  CusDisplayList: Array<QuoteFilterList> = new Array<QuoteFilterList>();
  PageStatusList: Array<PageStatus> = new Array<PageStatus>();
  FileListShow = false;
  constructor(
    @Inject(DOCUMENT) public document,
    public rest: RFQService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService
  ) { }

  ngOnInit() {
    this.CheckPageStatus();
    this.AllSupplierQuotaiton();
    console.log(this.document.getElementsByTagName('table'))
    console.log(this.AllDisplayViewUse);
  }
  ngOnDestroy() {
    var newpagestatus = new PageStatus();
    newpagestatus.SearchText = this.SearchText;
    newpagestatus.QuotationStatus = this.Search_Statu.toString();
    newpagestatus.PageNo = this.Page;
    newpagestatus.PageName = "RFQSupplierStatus";
    newpagestatus.groupselect = this.groupselect;
    if (this.PageStatusList.filter(x => x.PageName == "RFQSupplierStatus").length > 0) {
      this.PageStatusList = this.PageStatusList.filter(x => x.PageName != "RFQSupplierStatus");
      this.PageStatusList.push(newpagestatus);
      this.session.store(QuotationPageEnum.PageStatusList, this.PageStatusList);
    } else {
      this.PageStatusList.push(newpagestatus);
      this.session.store(QuotationPageEnum.PageStatusList, this.PageStatusList);
    };
  }

  TableRowColorChange(item: any, list: any) {
    list.forEach(x => {
      x.ClickColor = false
    });
    item.ClickColor = true;
  }

  SmartSearch(Page: number) {
    this.Page = Page;
    const request: SmartSearchSupplierQuoteStatusListRequest = {
      UserAccount: this.session.retrieve(LoginSessionEnum.UserAccount),
      SearchText: this.SearchText,
      Status: this.Search_Statu,
      Page: this.Page,
      PageCount: this.PageCount
    }
    this.spinnerService.show();
    this.rest.apiSmartSearchSupplierQuoteStatusList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.SupplierQuoteStatusList = res.supplierQuotesList;
        this.CanView = this.SupplierQuoteStatusList.filter(i => i.Representative.indexOf(this.CurrentUserName) != -1).length;
        this.TotalCount = res.TotalCount;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  loadPage(page: number) {
    this.Page = page;
    this.SmartSearch(page);
    this.tables.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  CheckPageStatus() {
    this.PageStatusList = this.session.retrieve(QuotationPageEnum.PageStatusList) == null ? new Array<PageStatus>() : this.session.retrieve(QuotationPageEnum.PageStatusList);
    if (this.PageStatusList.filter(x => x.PageName == "RFQSupplierStatus").length > 0) {
      this.PageStatusList.filter(x => x.PageName == "RFQSupplierStatus").forEach(x => {
        this.SearchText = x.SearchText;
        this.Page = x.PageNo;
        this.Search_Statu = Number(x.QuotationStatus);
        this.groupselect = x.groupselect;
      });
    }
    this.SmartSearch(this.Page);
    this.GroupColumn(this.groupselect);
  }

  AllSupplierQuotaiton() {
    this.spinnerService.show();
    const request = {
      UserAccount: this.session.retrieve(LoginSessionEnum.UserAccount),
      SearchText: this.SearchText,
      Status: this.Search_Statu
    }
    this.rest.apiAllSmartSearchSupplierQuoteStatusList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.AllSupplierQuoteStatusList = res.supplierQuotesList;
        this.SuppierDisplayList = new Array<QuoteFilterList>();
        this.QuoteDisplayList = new Array<QuoteFilterList>();
        this.CusDisplayList = new Array<QuoteFilterList>();

        this.AllSupplierQuoteStatusList.forEach(x => {
          var datediff = calcDate(new Date(
            Number.parseInt(x.QuoteDate.substring(0, 4)),
            Number.parseInt(x.QuoteDate.substring(4, 6)) - 1,
            Number.parseInt(x.QuoteDate.substring(6))), new Date(Date.now()), "day");

          if (this.QuoteDisplayList.filter(y => y.filteritem == x.QuoteNumber).length == 0) {
            var item1 = new QuoteFilterList();
            item1.filteritem = x.QuoteNumber;
            item1.finishqty = this.AllSupplierQuoteStatusList.filter(y => y.QuoteNumber == x.QuoteNumber && y.Status == '2').length;
            item1.unfinqty = this.AllSupplierQuoteStatusList.filter(y => y.QuoteNumber == x.QuoteNumber).length - item1.finishqty;
            this.QuoteDisplayList.push(item1);
          } else if (x.Status == '0' && this.QuoteDisplayList.filter(y => y.filteritem == x.QuoteNumber)[0].QuoteDays < datediff) {
            this.QuoteDisplayList.filter(y => y.filteritem == x.QuoteNumber)[0].QuoteDays = datediff;
            this.QuoteDisplayList.filter(y => y.filteritem == x.QuoteNumber)[0].QuoteDate = x.QuoteDate;
          }

          if (this.SuppierDisplayList.filter(y => y.filteritem == x.SupplierName).length == 0) {
            var item2 = new QuoteFilterList();
            item2.filteritem = x.SupplierName;
            item2.finishqty = this.AllSupplierQuoteStatusList.filter(y => y.SupplierName == x.SupplierName && y.Status == '2').length;
            item2.unfinqty = this.AllSupplierQuoteStatusList.filter(y => y.SupplierName == x.SupplierName).length - item2.finishqty;
            this.SuppierDisplayList.push(item2);
          } else if (x.Status == '0' && this.SuppierDisplayList.filter(y => y.filteritem == x.SupplierName)[0].QuoteDays < datediff) {
            this.SuppierDisplayList.filter(y => y.filteritem == x.SupplierName)[0].QuoteDays = datediff;
            this.SuppierDisplayList.filter(y => y.filteritem == x.SupplierName)[0].QuoteDate = x.QuoteDate;
          }
          if (this.CusDisplayList.filter(y => y.filteritem == x.CUSID).length == 0) {
            var item3 = new QuoteFilterList();
            item3.filteritem = x.CUSID;
            item3.finishqty = this.AllSupplierQuoteStatusList.filter(y => y.CUSID == x.CUSID && y.Status == '2').length;
            item3.unfinqty = this.AllSupplierQuoteStatusList.filter(y => y.CUSID == x.CUSID).length - item3.finishqty;
            this.CusDisplayList.push(item3);
          } else if (x.Status == '0' && this.CusDisplayList.filter(y => y.filteritem == x.CUSID)[0].QuoteDays < datediff) {
            this.CusDisplayList.filter(y => y.filteritem == x.CUSID)[0].QuoteDays = datediff;
            this.CusDisplayList.filter(y => y.filteritem == x.CUSID)[0].QuoteDate = x.QuoteDate;
          }
        })
        this.CanView = this.AllSupplierQuoteStatusList.filter(x => x.Representative.indexOf(this.CurrentUserName) != -1).length;
        this.TotalCount = res.TotalCount;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }


  setcollasp(listname: string, tagid: number) {
    switch (listname) {
      case "SuppierDisplay":
        if (this.SuppierDisplayList[tagid].collapsetag == "fa fa-minus") {
          this.SuppierDisplayList[tagid].collapsetag = "fa fa-plus";
          this.SuppierDisplayList[tagid].visiabletag = "collapse";
        }
        else {
          this.SuppierDisplayList[tagid].collapsetag = "fa fa-minus";
          this.SuppierDisplayList[tagid].visiabletag = "visible";
        }
        break;
      case "QuoteDisplay":
        if (this.QuoteDisplayList[tagid].collapsetag == "fa fa-minus") {
          this.QuoteDisplayList[tagid].collapsetag = "fa fa-plus";
          this.QuoteDisplayList[tagid].visiabletag = "collapse";
        }
        else {
          this.QuoteDisplayList[tagid].collapsetag = "fa fa-minus";
          this.QuoteDisplayList[tagid].visiabletag = "visible";
        }
        break;
      case "CusDisplay":
        if (this.CusDisplayList[tagid].collapsetag == "fa fa-minus") {
          this.CusDisplayList[tagid].collapsetag = "fa fa-plus";
          this.CusDisplayList[tagid].visiabletag = "collapse";
        }
        else {
          this.CusDisplayList[tagid].collapsetag = "fa fa-minus";
          this.CusDisplayList[tagid].visiabletag = "visible";
        }
        break;
    }

  }
  GroupColumn(dispaly: string) {
    switch (dispaly) {
      case "SuppierDisplay":
        this.AllDisplay = false;
        this.SuppierDisplay = true;
        this.QuoteDisplay = false;
        this.CusDisplay = false;
        break;
      case "QuoteDisplay":
        this.AllDisplay = false;
        this.SuppierDisplay = false;
        this.QuoteDisplay = true;
        this.CusDisplay = false;
        break;
      case "CusDisplay":
        this.AllDisplay = false;
        this.SuppierDisplay = false;
        this.QuoteDisplay = false;
        this.CusDisplay = true;
        break;
      case "AllDisplay":
        this.AllDisplay = true;
        this.SuppierDisplay = false;
        this.QuoteDisplay = false;
        this.CusDisplay = false;
        break;
    }

  }
  SortColumn(dispaly: number) {
    if (this.SortColumns[dispaly].SortText == "fa fa-arrows-v") {
      this.SortColumns[dispaly].SortText = "fa fa-caret-down";
      this.SortColumns[dispaly].SortType = "desc";
      this.SortColumns.filter(x => x.Order > 0).forEach(x => x.Order += 1);
      this.SortColumns[dispaly].Order += 1;
    }
    else if (this.SortColumns[dispaly].SortText == "fa fa-caret-down") {
      this.SortColumns[dispaly].SortText = "fa fa-caret-up";
      this.SortColumns[dispaly].SortType = "asc";
      this.SortColumns.filter(x => x.Order > 0).forEach(x => x.Order += 1);
      this.SortColumns[dispaly].Order += 1;
    } else {
      this.SortColumns[dispaly].SortText = "fa fa-arrows-v";
      this.SortColumns[dispaly].SortType = "";
      this.SortColumns[dispaly].Order = 0;
    }
    this.SupplierQuoteStatusList = multiSort(this.SupplierQuoteStatusList, this.SortColumns);
    this.AllSupplierQuoteStatusList = multiSort(this.AllSupplierQuoteStatusList, this.SortColumns);
  }


  queryQuotationAttachList(selectDetail: SupplierQuoteStatus) {
    this.spinnerService.show();
    this.selectDetail = selectDetail;
    const request: RFQAttachListRequest = {
      FORM_Quotation_ID: selectDetail.FORM_Quotation_ID,
      FORM_QuotationDetail_ID: this.selectDetail.FORM_QuotationDetail_ID,
      ListCount: '10',
      PageNumber: '1'
    }
    this.rest.apiRFQAttachList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.quotation_AttachList = res.QuotationAnnexReps;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  reportDialog(selectDetail: SupplierQuoteStatus) {
    this.spinnerService.show();
    const request: QuerySingleQuotationDetailRequest = {
      FORM_QuotationDetail_ID: selectDetail.FORM_QuotationDetail_ID,
      FORM_SupplierQuote_ID: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiQuerySingleQuotationDetail(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.QuotationDetail = res.quotationDetail;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  querySupplierAttachList(selectDetail: SupplierQuoteStatus) {
    this.spinnerService.show();
    const request: SupplierAttachAllListReqeust = {
      FORM_QuotationDetail_ID: selectDetail.FORM_QuotationDetail_ID,
      USR_Supplier_ID: selectDetail.USR_Supplier_ID,
      FORM_SupplierQuote_ID: selectDetail.FORM_SupplierQuote_ID
    }
    this.rest.apiSupplierAttachAllList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.SupplierAttachList = res.QuotationDetailAnnexReps;
        this.SupplierAttachLevelShow = [0];
        this.SupplierAttachList.forEach(x => {
          if (x.TextPage > 0) {
            this.SupplierAttachLevelShow.push(x.TextPage)
          }
        });
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe({
      error: () => {
        this.rest.commonErrorMsg();
      }
    }).add(() => {
      this.spinnerService.hide();
    });
  }

  queryDetailVendor(selectDetail: SupplierQuoteStatus) {
    this.spinnerService.show();
    this.selectDetail = selectDetail;
    const request: SingleSupplierQuoteLogListRequest = {
      FORM_QuotationDetail_ID: Number.parseInt(selectDetail.FORM_QuotationDetail_ID),
      USR_Supplier_ID: selectDetail.USR_Supplier_ID,
      UserAccount: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiSingleSupplierQuoteLogList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.selectDetail_VendorList = res.resultSupplierQuoteList;
        this.reportDialog(selectDetail);
        this.querySupplierAttachList(selectDetail);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  CaculateNewDetail() {

    if (this.QuotationDetail.SYS_QuoteType_ID == "13" || this.QuotationDetail.SYS_QuoteType_ID == "15") {
      this.newdetail.QuotePrice = Number.parseFloat(this.QuotationDetail.CastingWeight) * this.newdetail.QuoteWeightPrice;
    }
    else {
      this.newdetail.QuotePrice = this.newdetail.QuoteUnitPrice * this.newdetail.QuoteQty;
    }
  }

  AddSupplierQuotationDetail(newdetail: SupplierQuotationRecord) {
    newdetail.FORM_QuotationDetail_ID = this.QuotationDetail.FORM_QuotationDetail_ID;
    newdetail.UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
    newdetail.USR_Supplier_ID = this.selectDetail.USR_Supplier_ID;

    this.rest.API_InsertSupplierQuotationRecord(newdetail).then(
      (data) => {
        this.queryDetailVendor(this.selectDetail);
      }, (fail) => {

      }
    )
  }

  selectAddQuoteItem() {
    this.newdetail = new SupplierQuotationRecord();
    this.newdetail.QuotePrice = 0;
    this.newdetail.QuoteQty = 1;
    this.newdetail.QuoteUnitPrice = 0;
    this.newdetail.QuoteWeightPrice = 0;
  }

  DeleteSupplierRecord(selectDetail_VendorList: SupplierQuoteLog) {
    this.rest.API_Delete_SupplierRecord(selectDetail_VendorList.LOG_SupplierQuotationRecord_ID)
      .then(
        (list) => {
          this.queryDetailVendor(this.selectDetail);
        }, (fail) => {
        }
      )
  }

  chooseFile(files: FileList) {
    // this.document.getElementById('filestatus').setAttribute('style', 'color:red;visibility:hidden;');
    this.formData = new FormData();
    this.formData.append('fileupload', files.item(0), files.item(0).name);
    this.formData.append('FORM_QuotationDetail_ID', this.selectDetail.FORM_QuotationDetail_ID);
    this.formData.append('FORM_QuotationDetailSupplierMap_ID', this.selectDetail.FORM_QuotationDetailSupplierMap_ID.toString());
    this.formData.append('FORM_SupplierQuote_ID', this.selectDetail.FORM_SupplierQuote_ID.toString());
    this.formData.append('LoginAccount', this.session.retrieve(LoginSessionEnum.UserAccount));

  }

  uploadReportAttach() {
    if (this.document.getElementById('fileupload').value != "") {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:visible;');
      this.document.getElementById('fileupload').disabled = true;
      this.document.getElementById('fileupload_btn').disabled = true;
      this.rest.API_Upload_RFQDetailUploadAttach(this.formData).subscribe(
        x => {
          if (x.type === HttpEventType.UploadProgress) {
            this.Uploaded = (x.loaded / 1024).toFixed(0).toString() + "KB";
            this.UploadTotal = (x.total / 1024).toFixed(0).toString() + "KB";
            this.ProgressPercent = Math.round(100 * x.loaded / x.total);
          }
        },
        err => {
          console.log(err);
          this.document.getElementById('fileupload').value = "";
          this.document.getElementById('fileupload').setAttribute('files', '');
          this.Uploaded = "0KB";
          this.UploadTotal = "0KB";
          this.ProgressPercent = 0;
          this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
          this.document.getElementById('fileupload').disabled = false;
          this.document.getElementById('fileupload_btn').disabled = false;
          this.querySupplierAttachList(this.selectDetail);
        },
        () => {
          console.log("complete!");
          this.document.getElementById('fileupload').value = "";
          this.document.getElementById('fileupload').setAttribute('files', '');
          this.Uploaded = "0KB";
          this.UploadTotal = "0KB";
          this.ProgressPercent = 0;
          this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
          this.document.getElementById('fileupload').disabled = false;
          this.document.getElementById('fileupload_btn').disabled = false;
          this.querySupplierAttachList(this.selectDetail);
        }
      );
    } else {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
      this.document.getElementById('fileupload').disabled = false;
      this.document.getElementById('fileupload_btn').disabled = false;
    }
  }
  ClearOrderSque() {
    this.SortColumns = [
      { ColumnName: "QuoteDate", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "QuoteNumber", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "SupplierName", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "QuoteItemNumber", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "CUSID", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "Remark", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "QuoteTypeName", SortType: "", SortText: "fa fa-arrows-v", Order: 0 },
      { ColumnName: "Status", SortType: "", SortText: "fa fa-arrows-v", Order: 0 }
    ];
  }


}

function multiSort(array: any, sortObject: SortList[]): any {
  array.sort(function (a, b) {
    var bl: number = 0;
    var newsortlist: SortList[];
    newsortlist = sortObject.filter(x => x.SortType != "").sort(function (a, b) { return b.Order - a.Order });
    for (var x of newsortlist) {
      if (x.SortType == "desc") {
        bl = (bl == 0) ? (a[x.ColumnName].localeCompare(b[x.ColumnName])) : (bl || (a[x.ColumnName].localeCompare(b[x.ColumnName])));
      } else if (x.SortType == "asc") {
        bl = (bl == 0) ? (b[x.ColumnName].localeCompare(a[x.ColumnName])) : (bl || (b[x.ColumnName].localeCompare(a[x.ColumnName])));
      }
    }
    return bl;
  });
  return array;
}


function calcDate(date1: Date, date2: Date, type: string): number {
  var diff = Math.floor(date2.getTime() - date1.getTime());
  var day = 1000 * 60 * 60 * 24;
  switch (type) {
    case "day":
      return Math.floor(diff / day);
      break;
    case "month":
      return Math.floor(Math.floor(diff / day) / 31);
      break;
    case "year":
      return Math.floor(Math.floor(Math.floor(diff / day) / 31) / 12);
      break;
  }
}
