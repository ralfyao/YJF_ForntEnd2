
import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'ngx-webstorage';
import { CustomService } from 'src/app/Service/Custom.service';
import { RFQService } from 'src/app/Service/rfq.service';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { Customer, QuotationDetail, QuotationDetailVendor, Quotation, QuotationMailList, FileBatchList, QuoteTypeSelectList } from 'src/app/Model/vo';
import { HttpEventType } from '@angular/common/http';
import { PermissionService } from 'src/app/Service/permission.service';
import { SinglePermissionPerson } from 'src/app/Model/vo';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { SupplierMailList } from 'src/app/Model/ParamaterSetting';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgxSpinnerService } from 'ngx-spinner';
import { QueryCustomerListRequest } from 'src/bin/queryCustomerListRequest';
import { RFQAttachListRequest } from 'src/bin/rFQAttachListRequest';
import { QueryQuotationDetailListResponseQuotationDetailReps } from 'src/bin/queryQuotationDetailListResponseQuotationDetailReps';
import { QueryQuoteTypeListRequest } from 'src/bin/queryQuoteTypeListRequest';
import { QueryQuoteTypeListResponseQuoteTypeReps } from 'src/bin/queryQuoteTypeListResponseQuoteTypeReps';
import { AddQuotationRequest } from 'src/bin/addQuotationRequest';
import { BatchUpdateQuotationDetailRequest } from 'src/bin/batchUpdateQuotationDetailRequest';
import { of } from 'rxjs';


@Component({
  selector: 'app-add-rfq',
  templateUrl: './add-rfq.component.html',
  styleUrls: ['./add-rfq.component.css'],
  providers: [CustomService]
})
export class AddRfqComponent implements OnInit {
  @Input() Quotation: Quotation;
  @Input() Quotation_ID: string = "";
  IsProgressing = "1";/*1報價中2結案 */
  newdetail = new QuotationDetail();
  selectDetail = new QuotationDetail();
  selectDetail_VendorList: Array<QuotationDetailVendor>;
  selectDetail_AttachList: any;
  quotation_AttachList: any;
  customer: Customer = new Customer();
  customerPhone: string = "";
  customerContactPerson: string = "";
  customerlist: Array<Customer> = new Array<Customer>();
  vendorList: Array<QuotationDetailVendor>;
  vendorQueryName: string;
  quotationDetailList: Array<QueryQuotationDetailListResponseQuotationDetailReps> = new Array<QueryQuotationDetailListResponseQuotationDetailReps>();
  detailDistinctList: Array<QueryQuotationDetailListResponseQuotationDetailReps> = new Array<QueryQuotationDetailListResponseQuotationDetailReps>();
  QuotationDetailMailList: Array<QuotationMailList>;
  PageCount: number = 10;
  TotalCount: number = 0;
  QuoteRemark: string = "";
  QuoteNumber: string = "";
  Adder: string;
  UserName: string;
  Page: number = 1;
  formData: FormData = new FormData();
  Uploaded: string = "0KB";
  UploadTotal: string = "0KB";
  ProgressPercent: number = 0;
  Today: String = "";
  Permission: Array<SinglePermissionPerson>;
  MailAvaliable: boolean = true;
  MailStatus: Array<string> = new Array<string>();
  QuoteTypes: Array<QueryQuoteTypeListResponseQuoteTypeReps> = new Array<QueryQuoteTypeListResponseQuoteTypeReps>();
  QuoteTypesList: Array<QuoteTypeSelectList> = new Array<QuoteTypeSelectList>();
  customername: string = "";
  supplierMailList: Array<SupplierMailList>;
  FileBatchList: Array<FileBatchList> = new Array<FileBatchList>();
  FileSyncCheckBox: boolean = true;
  newremark: string;
  showstring: string = "";
  queryCustomerListRequest: QueryCustomerListRequest;
  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    public rest: RFQService,
    private cust: CustomService,
    private inj: Injector,
    private flashMessage: FlashMessagesService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private crypt: CustomValidateService) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;
    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['Q'])
      if (data == undefined) {
        this.Quotation = new Quotation();
      }
      else {
        this.Quotation = JSON.parse(data);
      }
      let cus = this.crypt.AESDecrypt(params['CUS'])
      if (cus == undefined) {
        this.customer = new Customer();
      }
      else {
        this.customer = JSON.parse(cus);
      }
    });
  }

  ngOnInit() {
    this.Today = new Date().getFullYear().toString() + "/" + (new Date().getMonth() + 1).toString() + "/" + new Date().getDate().toString();
    this.Adder = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.Permission = this.session.retrieve(LoginSessionEnum.Permission);
    this.UserName = this.session.retrieve(LoginSessionEnum.Name);
    this.queryCustomerListRequest = {
      Account: this.Adder,
      PageNumber: '1',
      ListCount: '10'
    }
    if (this.Quotation !== null && this.Quotation !== undefined) {
      this.Quotation_ID = this.Quotation.FORM_Quotation_ID;
      if (this.Quotation_ID != "null" && this.Quotation_ID != "") {
        this.querySingleRFQ(this.Quotation_ID);
        this.queryQuotationDetailList().subscribe();
      }
    }
    this.QueryQuoteTypes('15').subscribe();
  }

  QueryQuoteTypes(PageNumber: string) {
    this.spinnerService.show();
    const request: QueryQuoteTypeListRequest = {
      ListCount: 'All',
      PageNumber: PageNumber
    };
    return this.rest.apiQueryQuoteTypeList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.QuoteTypes = res.QuoteTypeReps;
        this.QuoteTypesList = new Array<QuoteTypeSelectList>();
        this.QuoteTypes.forEach(x => {
          var newquote = new QuoteTypeSelectList();
          newquote.Choice = false;
          newquote.PartNo = x.PartNo;
          newquote.QuoteTypeName = x.QuoteTypeName;
          newquote.Representative = x.Representative;
          newquote.SYS_QuoteType_ID = x.SYS_QuoteType_ID;
          this.QuoteTypesList.push(newquote);
        });
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  addRFQ(customer: Customer, QuoteRemark: string) {
    this.spinnerService.show();
    const request: AddQuotationRequest = {
      CST_Customer_ID: customer.CST_Customer_ID,
      LoginAccount: this.Adder,
      QuoteRemark: QuoteRemark
    };
    this.rest.apiAddQuotation(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.QuoteNumber = res.QuoteNumber;
        this.Quotation_ID = res.FORM_Quotation_ID;
        this.querySingleRFQ(this.Quotation_ID);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }



  remarkselect(selectDetail: QuotationDetail) {
    this.newdetail = selectDetail;
    this.selectDetail = JSON.parse(JSON.stringify(selectDetail));
    this.newremark = selectDetail.QuoteRemark;
    this.QuoteTypesList.forEach(x => {
      if (this.quotationDetailList.filter(z => z.QuoteItemNumber == selectDetail.QuoteItemNumber).map(z => z.QuoteTypeName).includes(x.QuoteTypeName)) {
        x.Choice = true;
      } else {
        x.Choice = false;
      }
      if (this.quotationDetailList.filter(z => z.QuoteItemNumber == selectDetail.QuoteItemNumber && z.QuoteTypeName == x.QuoteTypeName)[0] != undefined) {
        if (this.quotationDetailList.filter(z => z.QuoteItemNumber == selectDetail.QuoteItemNumber && z.QuoteTypeName == x.QuoteTypeName).map(z => z.IsQuoted.split('/').map(z => Number(z)).reduce((a, b) => a + b)).reduce((a, b) => a + b) > 0) {
          x.IsQuoted = true;
        } else {
          x.IsQuoted = false;
        }

      };

    });
  }

  Remarkchange(text: string, selectDetail: QuotationDetail) {
    selectDetail.QuoteRemark = text;
    this.updateQuotationDetail(selectDetail).subscribe();
  }

  /**
   *更新報價單品項資料
   *
   * @param {QuotationDetail} selectDetail
   * @memberof AddRfqComponent
   */
  updateQuotationDetail(selectDetail: QuotationDetail) {
    const request = {
      FORM_QuotationDetail_ID: selectDetail.FORM_QuotationDetail_ID,
      QuoteItemNumber: selectDetail.QuoteItemNumber,
      CastingWeight: selectDetail.CastingWeight,
      CastingMaterial: selectDetail.CastingMaterial,
      CastingSize: selectDetail.CastingSize,
      EstimateQuantity: selectDetail.EstimateQuantity,
      SYS_QuoteType_ID: selectDetail.SYS_QuoteType_ID,
      LoginAccount: this.Adder,
      QuoteRemark: selectDetail.QuoteRemark
    }
    return this.rest.apiUpdateQuotationDetail(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
      }),
      switchMap(() => {
        return this.queryQuotationDetailList()
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }


  QuotationDetailUpdateAll(newdetail: QuotationDetail, quotetypelist: Array<QuoteTypeSelectList>) {
    if (this.checkdetail()) {
      var newtable = new Array<QuotationDetail>();
      var QuoteItemNumber = newdetail.QuoteItemNumber;
      var newrow = new QuotationDetail();
      quotetypelist.filter(x => x.Choice).forEach(x => {
        newrow = JSON.parse(JSON.stringify(newdetail));
        newrow.SYS_QuoteType_ID = x.SYS_QuoteType_ID;
        newrow.Representative = x.Representative;
        newrow.QuoteTypeName = x.QuoteTypeName;
        newrow.FORM_QuotationDetail_ID = '';
        newtable.push(newrow);
      });

      const request: BatchUpdateQuotationDetailRequest = {
        QuotationDetailList: newtable,
        Account: this.Adder,
        FORM_Quotation_ID: this.Quotation_ID,
        QuoteItemNumber: QuoteItemNumber
      }
      this.rest.apiBatchUpdateQuotationDetail(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.spinnerService.hide();
          this.queryQuotationDetailList().subscribe();
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        })
      ).subscribe();

      this.newdetail = new QuotationDetail();
      var el = document.getElementById("Update_Modal_ItemSelector");
      var modal = Object.getOwnPropertyNames(el)
        .filter(n => n.startsWith("jQuery"))
        .map(n => el[n]["bs.modal"])
        .find(j => j !== undefined);
      modal.hide();
    } else {
      this.flashMessage.show(this.showstring, { cssClass: 'alert-success', timeout: 2000 });
    }

  }


  querySingleRFQ(Quotation_ID: string) {
    if (Quotation_ID.length != 0) {
      this.spinnerService.show();
      this.rest.API_Query_SingleQuotation(Quotation_ID).then(
        (data) => {
          this.spinnerService.hide();
          this.Quotation = data['QuotationRep'];
          this.QuoteNumber = data['QuotationRep']['QuoteNumber'];
          this.QuoteRemark = data['QuotationRep']['QuoteRemark'];
          this.IsProgressing = data['QuotationRep']['Status'];
          var CustomerID = data['QuotationRep']['CustomerID'];
          this.getSingleCustomer(CustomerID);
        },
        () => {
          this.spinnerService.hide();
        }
      )
    }
  }

  CustomerDataChange(Customer: Customer) {
    this.spinnerService.show();
    this.cust.API_UpdateCustomerVer2(Customer.CST_Customer_ID, Customer).then(
      (data) => {
        this.spinnerService.hide();
        this.customer = data['SingleCustomerDetailRep'];
      },
      () => {
        this.spinnerService.hide();
      }
    );
  }

  getSingleCustomer(CustomerID: string) {
    this.spinnerService.show();
    this.cust.API_Query_SingleCustomerDetail(CustomerID).then(
      (data) => {
        this.spinnerService.hide();
        this.customer = data['SingleCustomerDetailRep'];
      },
      () => {
        this.spinnerService.hide();
      }
    );

  }

  queryCustomerList() {
    this.queryCustomerListRequest.Nickname = this.customername;
    this.queryCustomerListRequest.ContactPerson = this.customerContactPerson;
    this.spinnerService.show();
    this.cust.apiQueryCustomerList(this.queryCustomerListRequest).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.customerlist = res.SingleCustomerDetailReps;
        this.TotalCount = +res.TotalCount;
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  queryQuotationDetailList() {
    this.spinnerService.show();
    this.quotationDetailList = new Array<QueryQuotationDetailListResponseQuotationDetailReps>();
    return this.rest.apiQueryQuotationDetailListRequest({ FORM_Quotation_ID: this.Quotation_ID, IsClosed: '' }).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.quotationDetailList = res.QuotationDetailReps;
        if (res.QuotationDetailReps) {
          this.quotationDetailList.forEach(i => {
            if (this.detailDistinctList.filter(y => y.QuoteItemNumber == i.QuoteItemNumber).length == 0) {
              this.detailDistinctList.push(i);
            }
          })
        }

      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  checkdetail() {
    this.showstring = "";
    if (this.newdetail.QuoteItemNumber.length == 0) {
      this.showstring += "報價品號不能空白,";
    }
    if (this.newdetail.CastingMaterial.length == 0) {
      this.showstring += "材質欄位不能空白,";
    }
    if (this.newdetail.CastingSize.length == 0) {
      this.showstring += "尺寸欄位不能空白,";
    }
    if (this.newdetail.EstimateQuantity.length == 0) {
      this.showstring += "年量欄位不能空白,";
    }
    if (this.newdetail.CastingWeight.length == 0) {
      this.showstring += "重量不能空白,";
    }
    if (this.QuoteTypesList.filter(x => x.Choice).length == 0) {
      this.showstring += "報價項目必須選擇一項";
    }

    if (this.showstring.length == 0) {
      return true;
    } else {
      return false;
    }

  }

  dividediv(item: QuotationDetail) {
    if (this.quotationDetailList != null) {
      var index = this.quotationDetailList.filter(x => x.QuoteItemNumber == item.QuoteItemNumber).length;
      var stylestring = '';
      for (let i = 0; i < index; i++) {

        stylestring += '40px ';
      }
      return { 'display': 'grid', 'grid-template-rows': stylestring };

    } else {
      return { 'display': 'grid', 'grid-template-rows': '' };
    }



  }

  TableRowColorChange(item: QuotationDetail) {
    this.selectDetail = JSON.parse(JSON.stringify(item));
  }



  checkmailreq(FORM_Quotation_ID: string) {
    this.spinnerService.show();
    this.rest.API_Query_SupplierMailList(FORM_Quotation_ID)
      .then(
        (list) => {
          this.spinnerService.hide();
          this.supplierMailList = list['supplierMailList'];
          this.supplierMailList = this.supplierMailList.filter(x => x.SupplierListString != '');
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }
  mailtoallselect(maillist: Array<SupplierMailList>) {
    maillist.forEach(x => x.Mailto = !x.Mailto);
  }

  sendsupplieremail(QuotationDetailMailList: Array<SupplierMailList>) {
    var sendlist = Array<string>();
    QuotationDetailMailList.filter(x => x.Mailto == true).forEach(x =>
      sendlist.push(x.FORM_QuotationDetail_ID)
    );
    if (sendlist.length != 0) {
      this.spinnerService.show();
      this.rest.API_SendReqToSupplier(sendlist).then(
        (data) => {
          this.spinnerService.hide();
          this.queryQuotationDetailList().subscribe();
        },
        () => {
          this.spinnerService.hide();
        }
      )
    }

  }



  addQuotationDetail() {
    //alert("123");
    this.spinnerService.show();
    this.newdetail.FORM_QuotationDetail_ID = this.Quotation_ID;
    if (this.checkdetail()) {
      this.QuoteTypesList.filter(x => x.Choice).forEach(x => {
        this.newdetail.QuoteTypeName = x.QuoteTypeName;
        this.newdetail.SYS_QuoteType_ID = x.SYS_QuoteType_ID;
        this.rest.API_Insert_AddQuotationDetail(this.newdetail, this.session.retrieve(LoginSessionEnum.UserAccount))
          .then(
            (list) => {
              this.queryQuotationDetailList().pipe().subscribe();
            }, (fail) => {
              this.spinnerService.hide();
            }
          );
      });
      this.newdetail = new QuotationDetail();
      var el = document.getElementById("Modal_ItemSelector");
      var modal = Object.getOwnPropertyNames(el)
        .filter(n => n.startsWith("jQuery"))
        .map(n => el[n]["bs.modal"])
        .find(j => j !== undefined);
      modal.hide();
      this.spinnerService.hide();
    } else {
      this.flashMessage.show(this.showstring, { cssClass: 'alert-success', timeout: 2000 });
      this.spinnerService.hide();
    }
  }

  CopyQuotationDetail(selectDetail: QuotationDetail) {
    this.spinnerService.show();
    selectDetail.FORM_QuotationDetail_ID = this.Quotation_ID;
    this.rest.API_Insert_AddQuotationDetail(selectDetail, this.session.retrieve(LoginSessionEnum.UserAccount))
      .then(
        (list) => {
          this.queryQuotationDetailList().subscribe();
          this.spinnerService.hide();
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }

  deleteQuotation() {
    if (confirm("確定要刪除這筆詢價單嗎？")) {
      this.spinnerService.show();
      this.rest.API_Delete_Quotation(this.Quotation_ID, this.session.retrieve(LoginSessionEnum.UserAccount))
        .then(
          (list) => {
            this.spinnerService.hide();
            this.backPage();
          }, (fail) => {
            this.spinnerService.hide();
          }
        )
    }
  }



  selectQuotationDetailVendor(selectDetail_Vendor: QuotationDetailVendor) {
    this.rest.API_Insert_QuotationDetailVendor(this.selectDetail.FORM_QuotationDetail_ID,
      selectDetail_Vendor.USR_Supplier_ID, this.session.retrieve(LoginSessionEnum.UserAccount))
      .then(
        (list) => {
          this.spinnerService.hide();
          this.queryDetailVendor(this.selectDetail);
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
    this.rest.API_Query_MemberList("10", "1");
  }

  deleteQuotationDetailVendor(selectDetail_Vendor: QuotationDetailVendor) {
    this.rest.API_Delete_QuotationDetailVendor(selectDetail_Vendor.FORM_QuotationDetailSupplierMap_ID, this.session.retrieve(LoginSessionEnum.UserAccount))
      .then(
        (list) => {
          this.spinnerService.hide();
          this.queryDetailVendor(this.selectDetail);
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }

  deleteQuotationDetail(selectDetail: QuotationDetail) {
    if (confirm("確定要刪除品項單：" + selectDetail.QuoteItemNumber + "嗎？")) {
      this.spinnerService.show();
      this.rest.API_Delete_QuotationDetail(selectDetail.FORM_QuotationDetail_ID, this.session.retrieve(LoginSessionEnum.UserAccount))
        .then(
          (list) => {
            this.queryQuotationDetailList().subscribe();
            this.spinnerService.hide();
          }, (fail) => {
            this.spinnerService.hide();
          }
        )
    }
  }

  customerloadPage(page: any) {
    this.Page = page;
    this.queryCustomerListRequest.PageNumber = this.Page.toString();
    this.queryCustomerList();
  }

  vendorloadPage(page: any) {
    this.Page = page;
    this.queryVendorList(String(page));
  }

  valueCheck(value: string, obj: any): boolean {
    if (value == "0") {
      return false;
    } else {
      return true;
    }
  }
  queryVendername(vendorQueryName: string) {
    this.spinnerService.show();
    this.vendorQueryName = vendorQueryName;
    this.rest.API_Query_SupplierList(this.vendorQueryName, "15", "1")
      .then(
        (list) => {
          this.vendorList = list['SupplierReps'];
          this.TotalCount = Number(list['TotalCount']);
          this.spinnerService.hide();
        }, (fail) => {
          this.spinnerService.hide();
          this.vendorList = null;
        }
      )
  }

  queryVendorList(StartPage: string) {
    this.spinnerService.show();
    this.rest.API_Query_SupplierList(this.vendorQueryName, "15", StartPage)
      .then(
        (list) => {
          this.vendorList = list['SupplierReps'];
          this.TotalCount = Number(list['TotalCount']);
          this.spinnerService.hide();
        }, (fail) => {
          this.spinnerService.hide();
          this.vendorList = null;
        }
      )
  }


  queryDetailVendor(selectDetail: QuotationDetail) {
    this.spinnerService.show();
    this.selectDetail = JSON.parse(JSON.stringify(selectDetail));
    this.rest.API_Query_RFQDetailSupplier(selectDetail.FORM_QuotationDetail_ID)
      .then(
        (list) => {
          this.selectDetail_VendorList = list['SupplierReps'];
          this.spinnerService.hide();
        }, (fail) => {
          this.spinnerService.hide();
          this.vendorList = null;
        }
      )
  }

  attachDialog(vendor: QuotationDetailVendor) {
    this.spinnerService.show();
    this.rest.API_Query_SupplierAttachNewestList(this.selectDetail.FORM_QuotationDetail_ID, this.selectDetail.USR_Supplier_ID)
      .then(
        (list) => {
          this.selectDetail_AttachList = list['QuotationDetailAnnexReps'];
          this.spinnerService.hide();
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }

  queryQuotationAttachList(selectDetail: QuotationDetail) {
    this.spinnerService.show();
    this.selectDetail = JSON.parse(JSON.stringify(selectDetail));
    const request: RFQAttachListRequest = {
      FORM_Quotation_ID: this.Quotation_ID,
      FORM_QuotationDetail_ID: this.selectDetail.FORM_QuotationDetail_ID,
      ListCount: '10',
      PageNumber: '1'
    }
    this.rest.apiRFQAttachList(request).pipe(
      tap(res => {
        if ((res.WorkStatus != 'OK' && res.WorkStatus != 'Success') && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.quotation_AttachList = res.QuotationAnnexReps;
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  FileBatchStatus(quotationDetail: QuotationDetail) {
    this.FileBatchList = new Array<FileBatchList>();
    this.quotationDetailList.forEach(x => {
      var newrow = new FileBatchList();
      newrow.FORM_QuotationDetail_ID = x.FORM_QuotationDetail_ID;
      newrow.Choice = quotationDetail.QuoteItemNumber == x.QuoteItemNumber ? true : false;
      newrow.QuoteItemNumber = x.QuoteItemNumber;
      newrow.QuoteTypeName = x.QuoteTypeName;
      this.FileBatchList.push(newrow);
    });
    this.FileBatchList.sort(function (a, b) {
      if (a.FORM_QuotationDetail_ID == quotationDetail.FORM_QuotationDetail_ID)
        return a.QuoteItemNumber.localeCompare(b.QuoteItemNumber) - 1;
      if (b.FORM_QuotationDetail_ID == quotationDetail.FORM_QuotationDetail_ID)
        return a.QuoteItemNumber.localeCompare(b.QuoteItemNumber) + 1;

    });
    this.rest.API_FileBatchSyncStatus(this.FileBatchList, Number(quotationDetail.FORM_QuotationDetail_ID))
      .then(
        (list) => {
          this.FileBatchList = list['Flist'];

        }, (fail) => {

        }
      );
    this.spinnerService.hide();
  }

  FileBatchUpload(quotationDetail: QuotationDetail, FileBatchList: Array<FileBatchList>) {
    this.rest.API_FileBatchUpload(FileBatchList, Number(quotationDetail.FORM_QuotationDetail_ID), this.session.retrieve(LoginSessionEnum.EmployeeID))
      .then(
        (list) => {
          this.FileBatchList = list['Flist'];
          this.FileBatchStatus(quotationDetail);
          this.queryQuotationDetailList().subscribe();
        }, (fail) => {

        }
      );
  }

  FileListCollpes() {
    var button = this.document.getElementById("FileListButton");
    var list = this.document.getElementById("FileCollapseBody");
    if (button.textContent == "收起表單") {
      button.textContent = "打開表單";
      list.setAttribute("style", "visibility: collapse");
    } else {
      button.textContent = "收起表單";
      list.setAttribute("style", "visibility : visible");
    }
  }

  chooseFile_Quotation(files: FileList) {
    // this.document.getElementById('filestatus').setAttribute('style', 'color:red;visibility:hidden;');
    this.formData = new FormData();
    this.formData.append('fileupload_main', files.item(0), files.item(0).name);
    this.formData.append('FORM_Quotation_ID', this.Quotation_ID);
    this.formData.append('FORM_QuotationDetail_ID', this.selectDetail.FORM_QuotationDetail_ID);
    this.Uploaded = "0KB";
    this.UploadTotal = "0KB";
    this.ProgressPercent = 0;
  }

  uploadQuotationAttach() {
    if (this.document.getElementById('fileupload_main').value != "") {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:visible;');
      this.document.getElementById('fileupload_main').disabled = true;
      this.document.getElementById('fileupload_btn').disabled = true;
      this.rest.API_Upload_RFQUploadAttach(this.formData).subscribe(
        x => {
          if (x.type === HttpEventType.UploadProgress) {
            this.Uploaded = (x.loaded / 1024).toFixed(0).toString() + "KB";
            this.UploadTotal = (x.total / 1024).toFixed(0).toString() + "KB";
            this.ProgressPercent = Math.round(100 * x.loaded / x.total);
          }
        },
        err => {
          console.log(err);
          this.document.getElementById('fileupload_main').value = "";
          this.document.getElementById('fileupload_main').setAttribute('files', '');
          this.Uploaded = "0KB";
          this.UploadTotal = "0KB";
          this.ProgressPercent = 0;
          this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
          this.document.getElementById('fileupload_main').disabled = false;
          this.document.getElementById('fileupload_btn').disabled = false;
          this.queryQuotationAttachList(this.selectDetail);
        },
        () => {
          console.log("complete!");
          this.document.getElementById('fileupload_main').value = "";
          this.document.getElementById('fileupload_main').setAttribute('files', '');
          this.Uploaded = "0KB";
          this.UploadTotal = "0KB";
          this.ProgressPercent = 0;
          this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
          this.document.getElementById('fileupload_main').disabled = false;
          this.document.getElementById('fileupload_btn').disabled = false;
          this.queryQuotationAttachList(this.selectDetail);
          if (this.FileSyncCheckBox) {
            this.FileBatchUpload(this.selectDetail, this.FileBatchList);
          }
          this.queryQuotationDetailList().subscribe();
        }
      );
    } else {
      this.document.getElementById('progressbar').setAttribute('style', 'visibility:hidden;');
      this.document.getElementById('fileupload_main').disabled = false;
      this.document.getElementById('fileupload_btn').disabled = false;
    }

  }

  deleteQuotationAttach(FORM_QuotationAnnexMap_ID: string) {
    this.spinnerService.show();
    this.rest.API_Delete_RFQAttach(FORM_QuotationAnnexMap_ID, this.session.retrieve(LoginSessionEnum.UserAccount))
      .then(
        (list) => {
          this.spinnerService.hide();
          this.queryQuotationAttachList(this.selectDetail);
          this.queryQuotationDetailList().subscribe();
          this.FileBatchStatus(this.selectDetail);
        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }
  InternalAudit() {
    this.spinnerService.show();
    var quotationidINT = +this.Quotation_ID;
    this.rest.API_InternalAudit(quotationidINT, 1)
      .then(
        (list) => {
          this.spinnerService.hide();
          this.Quotation = list['Quotation'];
          this.querySingleRFQ(this.Quotation_ID);

        }, (fail) => {
          this.spinnerService.hide();
        }
      )
  }

  modelclose() {
    this.queryQuotationDetailList().subscribe();
  }

  backPage() {
    if (confirm("確定要回列表嗎？")) {
      this.router.navigate(['login_success/RFQList']);
    }
  }
}
