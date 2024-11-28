import { Component, OnInit, Injector } from '@angular/core';
import { MoService } from 'src/app/Service/mo.service';
import { Router, RouterState, ActivatedRoute } from '@angular/router';
import { CustomValidateService } from 'src/app/Service/custom-validate.service';
import { PermissionService } from 'src/app/Service/permission.service';
import { SessionStorageService } from 'ngx-webstorage';
import { MaintainOrder, ApartList, EmployeeApartList, SupplierAllList, TaxCodeList, PaymentTermList, ASMTO, ASMTQ, ASMTH, ASMTG, ASMTP, ASMTN, ProblemCodeList, MaintainOrderList, SolutionCodeList, MaintainOrderLists, MaintainRequest } from 'src/app/Model/vo';
import * as $ from 'jquery';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { AssetList } from 'src/app/Model/vo';
import { MemberManageService } from '../../Service/member-manage.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgxSpinnerService } from 'ngx-spinner';
import { QueryMatainRequestRequest } from 'src/bin/queryMatainRequestRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProblemListRequest } from 'src/bin/problemListRequest';
import { UpdateMaintainOrderRequest } from 'src/bin/updateMaintainOrderRequest';
import { PaymentTermListRequest } from 'src/bin/paymentTermListRequest';
import { SupplierAllListRequest } from 'src/bin/supplierAllListRequest';
import { QueryMatainorderRequest } from 'src/bin/queryMatainorderRequest';
import { QueryAssetListRequest } from 'src/bin/queryAssetListRequest';
import { SolutionCodeListReqeust } from 'src/bin/solutionCodeListReqeust';
import { TaxCodeListRequest } from 'src/bin/taxCodeListRequest';
import { ModifyMatainorderRequest } from 'src/bin/modifyMatainorderRequest';
import { ComApartmentListRequest } from 'src/bin/comApartmentListRequest';

@Component({
  selector: 'app-addmatainorder',
  templateUrl: './addmatainorder.component.html',
  styleUrls: ['./addmatainorder.component.css']
})
export class AddmatainorderComponent implements OnInit {
  ASMTG_TG001String: string = "保修工單";
  AccountIdentity: string = LoginSessionEnum.AccountIdentity;
  public problemcodelist: Array<ProblemCodeList> = new Array<ProblemCodeList>();
  public assetlist: Array<AssetList> = new Array<AssetList>();
  public apartlist: Array<ApartList> = new Array<ApartList>();
  public employeeapartlist: Array<EmployeeApartList> = new Array<EmployeeApartList>();
  public supplieralls: Array<SupplierAllList> = new Array<SupplierAllList>();
  public taxcodelist: Array<TaxCodeList> = new Array<TaxCodeList>();
  public paymenttermlist: Array<PaymentTermList> = new Array<PaymentTermList>();
  public MaintainOrderList: MaintainOrderList = new MaintainOrderList();
  AssetNo: string = "";
  AssetName: string = "";
  TotalCount: number = 0;
  PageCount: number = 10;
  Page: number = 1;
  asset: AssetList = new AssetList();
  problemcode: ProblemCodeList = new ProblemCodeList();
  apart: ApartList = new ApartList();
  EmAp: EmployeeApartList = new EmployeeApartList();
  supplier: SupplierAllList = new SupplierAllList();
  taxcode: TaxCodeList = new TaxCodeList();
  paymentterm: PaymentTermList = new PaymentTermList();
  ASMTGMatainHead: ASMTG = new ASMTG();
  ASMTPOutsourceHead: ASMTP = new ASMTP();
  ASMTNInhouseHead: ASMTN = new ASMTN();
  mataindetail: ASMTH = new ASMTH();
  ApartNo: string = "";
  ApartName: string = "";
  MD001: string = "";
  MD002: string = "";
  ASMTH015Date: Date = new Date();
  ASMTH016Date: Date = new Date();
  ASMTH017Date: Date = new Date();
  ASMTH018Date: Date = new Date();
  ASMTG003Date: Date = new Date();
  ASMTG002: string = "";


  /**
      @CMSMV001 {員工代號}
  */
  CMSMV001: string;
  /**
      @CMSMV002 {員工名稱}
  */
  CMSMV002: string;
  /**
      @CMSMV004 {部門名稱}
  */
  CMSMV004: string;
  /**
      @PURMA001 {供應商代號}
  */
  PURMA001: string;
  /**
      @PURMA002 {供應商名稱}
  */
  PURMA002: string;
  /**
      @PURMA013 {供應商聯絡人}
  */
  PURMA013: string;
  /**
      @PURMA076 {稅別碼代號}
  */
  PURMA076: string;
  /**
      @PURMA055 {付款條件代號}
  */
  PURMA055: string;
  /**
      @CMSNN001 {稅別碼代號}
  */
  CMSNN001: string;
  /**
      @CMSNN002 {稅別碼名稱}
  */
  CMSNN002: string;
  /**
      @CMSNA002 {交易條件代號}
  */
  CMSNA002: string;
  /**
    @CMSNA003 {交易條件名稱}
  */
  CMSNA003: string;


  settings = {
    format: 'yyyyMMdd',
  }
  Formcheck = {
    Check: true,
    msg: ''
  }
  solution: SolutionCodeList = new SolutionCodeList();
  solutionlist: Array<SolutionCodeList> = new Array<SolutionCodeList>();
  ME001: string = "";
  ME002: string = "";
  Validation: number;
  Permission: any;
  acc: string;
  MatainOrderClose: boolean;
  matainrequestlist: Array<MaintainRequest> = new Array<MaintainRequest>();
  matainrequest: MaintainRequest = new MaintainRequest();
  MO: MaintainOrder;
  ASMTA002: string;
  ASMTA003: string;
  ASMTA004: string;
  ASMTA005: string;
  ASMTA007: string;
  ASMTA008: string;
  ASMTG007String: string = "未保修";
  SearchText: string;
  Errmsg: string;



  constructor(
    private router: Router,
    private rest: MoService,
    private AccountService: MemberManageService,
    private inj: Injector,
    private spinnerService: NgxSpinnerService,
    private flashMessage: FlashMessagesService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private crypt: CustomValidateService) {
    const state: RouterState = this.router.routerState;
    const root: ActivatedRoute = state.root;

    root.queryParams.subscribe(params => {
      let data = this.crypt.AESDecrypt(params['MO'])
      if (data == undefined) {
        this.MO = new MaintainOrder();
      }
      else {
        this.MO = JSON.parse(data);
      }
    });
  }




  ngOnInit() {
    this.AccountIdentity = this.session.retrieve(LoginSessionEnum.AccountIdentity);
    this.acc = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.Permission = this.session.retrieve(LoginSessionEnum.Permission);
    if (this.MO.DocumentNumber != '') {
      this.QueryMatainOrder();
    }
    this.MaintainOrderSync();
  }

  QueryApartList(ApartNo: string, ApartName: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    const request: ComApartmentListRequest = {
      QueryApartNo: ApartNo,
      QueryApartName: ApartName,
      Page: page,
      PageCount: 10
    }
    this.rest.apiComApartmentList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.apartlist = res.apartmentlist;
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
  selectApart(apart: ApartList) {
    this.apart = apart;
    this.CMSMV004 = apart.ApartName;
    this.ASMTGMatainHead.TG010 = apart.ApartNo;
    this.MaintainOrderList.ASMTG.TG010 = apart.ApartNo;
    this.MaintainOrderSync();
  }
  ApartloadPage(page: number) {
    this.spinnerService.show();
    const request: ComApartmentListRequest = {
      QueryApartNo: this.ApartNo,
      QueryApartName: this.ApartName,
      Page: page,
      PageCount: 10
    }
    this.rest.apiComApartmentList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.apartlist = res.apartmentlist;
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
  ClearApart() {
    this.ApartNo = "";
    this.ApartName = "";
    this.ASMTGMatainHead.TG010 = "";
  }

  QueryAssetList(AssetNo: string, AssetName: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    this.MaintainOrderSync();
    const request: QueryAssetListRequest = {
      QueryAssetNo: AssetNo,
      QueryAssetName: AssetName,
      Page: page,
      PageCount: 10
    }
    this.rest.apiQueryAssetList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.assetlist = res.QueryAssetList;
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
  assetloadPage(page: number) {
    this.spinnerService.show();
    const request: QueryAssetListRequest = {
      QueryAssetNo: this.AssetNo,
      QueryAssetName: this.AssetName,
      Page: page,
      PageCount: 10
    }
    this.rest.apiQueryAssetList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.assetlist = res.QueryAssetList;
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
  selectAsset(asset: AssetList) {
    this.asset = asset;
    this.ASMTGMatainHead.TG008 = asset.AssetNo;
    this.MaintainOrderList.ASMTG.TG008 = asset.AssetNo;
    this.matainrequest.ASMTA007 = this.asset.AssetNo;
    this.matainrequest.ASMTA007String = this.asset.AssetName;
    this.matainrequest.ASMTA007Spec = this.asset.AssetSpec;
    this.MaintainOrderSync();
  }
  ClearAsset() {
    this.AssetNo = "";
    this.AssetName = "";
    this.ASMTGMatainHead.TG008 = "";
  }


  tablejs() {
    /*選保修單時高亮*/
    $('#MOdetailTable').on('click', 'tbody tr', function () {
      $(this).addClass('table-warning').siblings().removeClass('table-warning');
    });
  }

  backPage() {
    this.router.navigate(['login_success/MantainOrder']);
  }


  ASMTGTG004Change(value: string) {
    this.apart = new ApartList();
    this.EmAp = new EmployeeApartList();
    this.supplier = new SupplierAllList();
    this.PURMA076 = "";
    this.PURMA055 = "";
    this.taxcodelist = new Array<TaxCodeList>();
    this.taxcode = new TaxCodeList;

  }
  QueryEmployeeApartList(MV001: string, MV002: string, MV004: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    if (this.apart.ApartName != null) {
      this.CMSMV004 = this.apart.ApartName;
      MV004 = this.apart.ApartName;
    }
    this.AccountService.API_QueryEmployeeApartList(MV001, MV002, MV004, page, 10).then(
      (data) => {
        this.spinnerService.hide();
        this.employeeapartlist = data['employeeapartlist'];
        this.TotalCount = data['TotalCount'];
      },
      () => {
        this.spinnerService.hide();
      }
    )

  }
  EmployeeApartloadPage(page: number) {
    this.spinnerService.show();
    this.AccountService.API_QueryEmployeeApartList(this.CMSMV001, this.CMSMV002, this.CMSMV004, page, 10).then(
      (data) => {
        this.spinnerService.hide();
        this.employeeapartlist = data['employeeapartlist'];
        this.TotalCount = data['TotalCount'];
      },
      () => {
        this.spinnerService.hide();
      }
    )
  }
  ClearEmAp() {
    this.CMSMV001 = "";
    this.CMSMV002 = "";
    this.CMSMV004 = "";
  }
  selectEmAp(value: EmployeeApartList) {
    this.EmAp = value;
    this.MaintainOrderList.ASMTG.TG011 = this.EmAp.CMSMV001;
    this.MaintainOrderSync();
  }
  QuerySupplierList(PURMA001: string, PURMA002: string, PURMA013: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    const request: SupplierAllListRequest = {
      PURMA001: PURMA001,
      PURMA002: PURMA002,
      PURMA013: PURMA013,
      Page: page,
      PageCount: 10
    }
    this.AccountService.apiSupplierAllList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.supplieralls = res.supplieralls;
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
  SupplierloadPage(page: number) {
    this.spinnerService.show();
    const request: SupplierAllListRequest = {
      PURMA001: this.PURMA001,
      PURMA002: this.PURMA002,
      PURMA013: this.PURMA013,
      Page: page,
      PageCount: 10
    }
    this.AccountService.apiSupplierAllList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.supplieralls = res.supplieralls;
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
  selectsupplier(supplier: SupplierAllList) {
    this.supplier = supplier;
    this.PURMA076 = supplier.PURMA076;
    this.PURMA055 = supplier.PURMA055;
    this.taxcode.CMSNN001 = supplier.PURMA076;
    this.taxcode.CMSNN002 = supplier.CMSNN02;
    this.paymentterm.CMSNA002 = supplier.PURMA055;
    this.paymentterm.CMSNA003 = supplier.CMSNA03;
    this.MaintainOrderList.ASMTG.TG012 = supplier.PURMA001;
    this.MaintainOrderList.ASMTG.TG013 = supplier.PURMA076;
    this.MaintainOrderList.ASMTG.TG020 = supplier.PURMA055;
    this.MaintainOrderList.ASMTG.TG014 = supplier.PURMA044;
    this.MaintainOrderList.ASMTG.TG015 = Number.parseFloat(supplier.CMSNN04);
    this.MaintainOrderList.ASMTG.TG016 = supplier.PURMA021;
    this.MaintainOrderList.ASMTP.TP023 = supplier.PURMA030;
    this.MaintainOrderList.ASMTP.TP025 = supplier.PURMA005;
    switch (supplier.PURMA021.trim()) {
      case "NTD":
        this.MaintainOrderList.ASMTG.TG017 = 1;
        break;
      case "USD":
        this.MaintainOrderList.ASMTG.TG017 = 31;
        break;
      case "EUR":
        this.MaintainOrderList.ASMTG.TG017 = 35;
        break;
      case "JPY":
        this.MaintainOrderList.ASMTG.TG017 = 0.28;
        break;
    }
    this.MaintainOrderSync();
  }
  ClearSupplier() {
    this.PURMA001 = "";
    this.PURMA002 = "";
    this.PURMA013 = "";
  }

  QueryTaxCodeList(CMSNN001: string, CMSNN002: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    const request: TaxCodeListRequest = {
      CMSNN001: CMSNN001,
      CMSNN002: CMSNN002,
      Page: page,
      PageCount: 10
    }
    this.rest.apiTaxCodeList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.taxcodelist = res.taxcodelist;
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
  selecttaxcode(taxcode: TaxCodeList) {
    this.taxcode = taxcode;
    this.MaintainOrderList.ASMTG.TG013 = taxcode.CMSNN001;
    this.MaintainOrderList.ASMTG.TG014 = taxcode.CMSNN006;
    this.MaintainOrderList.ASMTG.TG015 = Number.parseFloat(taxcode.CMSNN004);
    this.MaintainOrderSync();
  }
  TaxCodeListloadPage(page: number) {
    this.spinnerService.show();
    const request: TaxCodeListRequest = {
      CMSNN001: this.CMSNN001,
      CMSNN002: this.CMSNN002,
      Page: page,
      PageCount: 10
    }
    this.rest.apiTaxCodeList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.taxcodelist = res.taxcodelist;
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
  ClearTaxCode() {
    this.CMSNN001 = "";
    this.CMSNN002 = "";
  }
  QueryPaymnetTermList(CMSNA002: string, CMSNA003: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    const request: PaymentTermListRequest = {
      CMSNA002: CMSNA002,
      CMSNA003: CMSNA003,
      Page: page,
      PageCount: 10
    }
    this.rest.apiPaymentTermList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.paymenttermlist = res.paymenttermlist;
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
  selectpaymentterm(paymentterm: PaymentTermList) {
    this.paymentterm = paymentterm;
    this.MaintainOrderList.ASMTG.TG020 = paymentterm.CMSNA002;
    this.MaintainOrderSync();
  }
  PaymentTermListloadPage(page: number) {
    this.spinnerService.show();
    const request: PaymentTermListRequest = {
      CMSNA002: this.CMSNA002,
      CMSNA003: this.CMSNA003,
      Page: page,
      PageCount: 10
    }
    this.rest.apiPaymentTermList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.paymenttermlist = res.paymenttermlist;
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
  ClearPaymentTerm() {
    this.CMSNA002 = "";
    this.CMSNA003 = "";
  }

  QuerySolutionList(ME001: string, ME002: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    const request: SolutionCodeListReqeust = {
      ME001: ME001,
      ME002: ME002,
      Page: page,
      PageCount: 10
    }
    this.rest.apiSolutionCodeList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.solutionlist = res.solutioncodelist;
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
  selectsolution(solution: SolutionCodeList) {
    this.solution = solution;
    this.MaintainOrderList.outsourcematain.forEach(x => {
      if (this.mataindetail.TH003 == x.TQ003) {
        x.TQ008 = solution.ME001.trim();
        x.TQ009 = solution.ME002.trim();
      }
    });
    this.MaintainOrderList.inhousementain.forEach(x => {
      if (this.mataindetail.TH003 == x.TO003) {
        x.TO008 = solution.ME001.trim();
        x.TO009 = solution.ME002.trim();
      }
    });

    this.MaintainOrderSync();
  }

  SolutionloadPage(page: number) {
    this.spinnerService.show();
    const request: SolutionCodeListReqeust = {
      ME001: this.ME001,
      ME002: this.ME002,
      Page: page,
      PageCount: 10
    }
    this.rest.apiSolutionCodeList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.solutionlist = res.solutioncodelist;
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
  clearsolution() {
    this.ME001 = "";
    this.ME002 = "";
  }



  ProblemCodeList(MD001: string, MD002: string, page: number) {
    this.spinnerService.show();
    this.Page = page;
    const request: ProblemListRequest = {
      MD001: MD001,
      MD002: MD002,
      Page: page,
      PageCount: 10
    }
    this.rest.apiProblemList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.problemcodelist = res.problemlist;
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
  selectproblemcode(problemcode: ProblemCodeList) {
    this.problemcode = problemcode;
    this.MaintainOrderList.maintaindetail.forEach(x => {
      if (x.TH003 == this.mataindetail.TH003) {
        x.TH004 = problemcode.MD001;
        x.TH005 = problemcode.MD002;
      }
    })
  }
  ProblemCodeloadPage(page: number) {
    this.spinnerService.show();
    const request: ProblemListRequest = {
      MD001: this.MD001,
      MD002: this.MD002,
      Page: page,
      PageCount: 8
    }
    this.rest.apiProblemList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.problemcodelist = res.problemlist;
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
  ClearProblemCode() {
    this.MD001 = "";
    this.MD002 = "";
  }
  QueryMatainRequestList(page: number) {
    this.spinnerService.show();
    this.Page = page;
    this.matainrequestloadPage(page);
  }
  selectmatainrequest(matainrequest: MaintainRequest) {
    this.matainrequest = matainrequest;
    this.MaintainOrderList.ASMTG.TG008 = this.matainrequest.ASMTA007;
    this.MaintainOrderList.ASMTG.TG009 = this.matainrequest.ASMTA008;
    this.asset.AssetNo = this.matainrequest.ASMTA007;
    this.asset.AssetName = this.matainrequest.ASMTA007String;
    this.asset.AssetSpec = this.matainrequest.ASMTA007Spec;
    this.MaintainOrderSync();

  }
  matainrequestloadPage(page: number) {
    this.spinnerService.show();
    const request: QueryMatainRequestRequest = {
      SearchText: this.SearchText,
      Page: page,
      PageCount: 8
    }
    this.rest.apiQueryMatainRequest(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.matainrequestlist = res.matainrequestlist;
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
  Clearmatainrequest() {
    this.ASMTA002 = "";
    this.ASMTA003 = "";
    this.ASMTA004 = "";
    this.ASMTA005 = "";
    this.ASMTA007 = "";
    this.ASMTA008 = "";
  }

  AddNewASMTH() {
    this.mataindetail = new ASMTH();
    var inhousemaintain = new ASMTO();
    var outsourcemaintain = new ASMTQ();
    this.mataindetail.TH003 = (this.MaintainOrderList.maintaindetail.length + 1).toString();
    while (this.mataindetail.TH003.length < 4) {
      this.mataindetail.TH003 = '0' + this.mataindetail.TH003;
    }
    while (this.MaintainOrderList.maintaindetail.findIndex(x => x.TH003 == this.mataindetail.TH003) >= 0) {
      this.mataindetail.TH003 = (Number.parseInt(this.mataindetail.TH003) + 1).toString();
      while (this.mataindetail.TH003.length < 4) {
        this.mataindetail.TH003 = '0' + this.mataindetail.TH003;
      }
    }

    if (this.MaintainOrderList.maintaindetail.length == 0 || this.MaintainOrderList.maintaindetail.every(x => IsBlankorEmpty(x.TH004) && IsBlankorEmpty(x.TH005))) {
      this.MaintainOrderList.maintaindetail.push(this.mataindetail);
      inhousemaintain.TO003 = this.mataindetail.TH003;
      this.MaintainOrderList.inhousementain.push(inhousemaintain);
      outsourcemaintain.TQ003 = this.mataindetail.TH003;
      this.MaintainOrderList.outsourcematain.push(outsourcemaintain);

      this.Formcheck.Check = true;
      this.Formcheck.msg = '';
    }
    else {
      this.Formcheck.Check = false;
      this.Formcheck.msg = '請輸入保修代號';
    }
    this.MaintainOrderSync();

  }
  UniASMTHDate(TH003NO: string, newdate: Date) {
    this.ASMTH015Date = newdate;
    this.ASMTH016Date = newdate;
    this.ASMTH017Date = newdate;
    this.ASMTH018Date = newdate;
    this.MaintainOrderList.maintaindetail.forEach(x => {
      if (x.TH003 == TH003NO) {
        x.TH015 = DatetoyyyyMMdd(this.ASMTH015Date);
        x.TH016 = DatetoyyyyMMdd(this.ASMTH016Date);
        x.TH017 = DatetoyyyyMMdd(this.ASMTH017Date);
        x.TH018 = DatetoyyyyMMdd(this.ASMTH018Date);
      }
    });


  }
  ChangeASMTH(TH003NO: string, newdate: Date) {
    this.MaintainOrderList.maintaindetail.forEach(x => {
      if (x.TH003 == TH003NO) {
        x.TH015 = DatetoyyyyMMdd(this.ASMTH015Date);
        x.TH016 = DatetoyyyyMMdd(this.ASMTH016Date);
        x.TH017 = DatetoyyyyMMdd(this.ASMTH017Date);
        x.TH018 = DatetoyyyyMMdd(this.ASMTH018Date);
      }
    })

  }

  querysingleDetail(mataindetail: ASMTH) {
    this.mataindetail = mataindetail;
    this.ASMTH015Date = mataindetail.TH015.length > 0 ? StringToDate(mataindetail.TH015) : new Date();
    this.ASMTH016Date = mataindetail.TH016.length > 0 ? StringToDate(mataindetail.TH016) : new Date();
    this.ASMTH017Date = mataindetail.TH017.length > 0 ? StringToDate(mataindetail.TH017) : new Date();
    this.ASMTH018Date = mataindetail.TH018.length > 0 ? StringToDate(mataindetail.TH018) : new Date();

  }
  deletedetail(mataindetail: ASMTH) {
    var delinhouse = this.MaintainOrderList.inhousementain.findIndex(x => x.TO003 == mataindetail.TH003);
    var delmaintain = this.MaintainOrderList.maintaindetail.findIndex(x => x.TH003 == mataindetail.TH003);
    var deloutsouce = this.MaintainOrderList.outsourcematain.findIndex(x => x.TQ003 == mataindetail.TH003);
    this.MaintainOrderList.inhousementain.splice(delinhouse, 1);
    this.MaintainOrderList.maintaindetail.splice(delmaintain, 1);
    this.MaintainOrderList.outsourcematain.splice(deloutsouce, 1);
  }
  QueryMatainOrder() {
    this.spinnerService.show();
    const request: QueryMatainorderRequest = {
      DocumentType: this.MO.DocumentType,
      DocumentNumber: this.MO.DocumentNumber
    }
    this.rest.apiQueryMatainorder(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.MaintainOrderList = res.MaintainOrderList;
        this.MaintainOrderList.ASMTG.TG001 = this.MaintainOrderList.ASMTG.TG001.trim();
        this.matainrequest.ASMTA002 = this.MaintainOrderList.maintaindetail[0].TH023;
        this.apart.ApartName = res.ApartName;
        this.apart.ApartNo = this.MaintainOrderList.ASMTG.TG010;
        this.EmAp.CMSMV001 = this.MaintainOrderList.ASMTG.TG011;
        this.EmAp.CMSMV002 = res.EmpName;
        this.EmAp.CMSMV004 = this.MaintainOrderList.ASMTG.TG010;
        this.asset.AssetSpec = res.AssetSpec.trim();
        this.asset.AssetName = res.AssetName.trim();
        this.asset.AssetNo = res.AssetNo.trim();
        if (this.MaintainOrderList.outsourcematain.length > 0) {
          this.MatainOrderClose = this.MaintainOrderList.outsourcematain.every(x => x.TQ020 == "Y" || x.TQ020 == "y") ? true : false;
        } else {
          this.MatainOrderClose = false;
        }
        this.spinnerService.hide();
      }),
      switchMap(() => {
        this.spinnerService.show();
        const request: SupplierAllListRequest = {
          PURMA001: this.MaintainOrderList.ASMTG.TG012,
          PURMA002: '',
          PURMA013: '',
          Page: 1,
          PageCount: 10
        }
        return this.AccountService.apiSupplierAllList(request)
      }),
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.supplieralls = res.supplieralls;
        this.supplier = this.supplieralls[0];
        this.PURMA076 = this.supplier.PURMA076;
        this.PURMA055 = this.supplier.PURMA055;
        this.taxcode.CMSNN001 = this.supplier.PURMA076;
        this.taxcode.CMSNN002 = this.supplier.CMSNN02;
        this.paymentterm.CMSNA002 = this.supplier.PURMA055;
        this.paymentterm.CMSNA003 = this.supplier.CMSNA03;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  MaintainOrderSync() {
    this.MatainOrderClose = this.MaintainOrderList.outsourcematain.every(x => x.TQ020 == "Y" || x.TQ020 == "y") ? true : false;
    this.MaintainOrderList.ASMTG.TG003 = DatetoyyyyMMdd(this.ASMTG003Date);
    this.MaintainOrderList.ASMTG.TG030 = DatetoyyyyMMdd(this.ASMTG003Date);
    this.MaintainOrderList.ASMTG.TG002 = this.ASMTG002;
    this.MaintainOrderList.ASMTG.TG008 = this.matainrequest.ASMTA007;
    this.MaintainOrderList.ASMTG.TG009 = this.matainrequest.ASMTA008 == '' ? this.MaintainOrderList.ASMTG.TG009 : this.matainrequest.ASMTA008;
    this.asset.AssetNo = this.matainrequest.ASMTA007;
    this.asset.AssetName = this.matainrequest.ASMTA007String;
    this.asset.AssetSpec = this.matainrequest.ASMTA007Spec;
    switch (this.MaintainOrderList.ASMTG.TG001) {
      case "N20":
        this.MaintainOrderList.ASMTP = new ASMTP();
        this.MaintainOrderList.ASMTG.TG001 = "N20";
        this.MaintainOrderList.ASMTG.TG004 = "1";
        this.MaintainOrderList.ASMTN.TN001 = "N51";
        this.MaintainOrderList.ASMTN.TN003 = this.MaintainOrderList.ASMTG.TG003;
        this.MaintainOrderList.ASMTN.TN004 = this.MaintainOrderList.ASMTG.TG010;
        this.MaintainOrderList.ASMTN.TN005 = this.MaintainOrderList.ASMTG.TG011;
        this.MaintainOrderList.ASMTN.TN007 = this.MaintainOrderList.ASMTG.TG003;
        this.MaintainOrderList.inhousementain.forEach(x => {
          x.TO001 = this.MaintainOrderList.ASMTN.TN001;
          x.TO002 = this.MaintainOrderList.ASMTN.TN002;
          x.TO004 = this.MaintainOrderList.ASMTG.TG006;
          x.TO005 = this.MaintainOrderList.ASMTG.TG001;
          x.TO006 = this.MaintainOrderList.ASMTG.TG002;
          x.TO007 = x.TO003;
        });

        break;
      case "N21":
        this.MaintainOrderList.ASMTN = new ASMTN();
        this.MaintainOrderList.ASMTG.TG001 = "N21";
        this.MaintainOrderList.ASMTG.TG004 = "2";
        this.MaintainOrderList.ASMTP.TP001 = "N60";
        this.MaintainOrderList.ASMTP.TP003 = this.MaintainOrderList.ASMTG.TG003;
        this.MaintainOrderList.ASMTP.TP004 = this.MaintainOrderList.ASMTG.TG012;
        this.MaintainOrderList.ASMTP.TP005 = this.MaintainOrderList.ASMTG.TG013;
        this.MaintainOrderList.ASMTP.TP006 = this.MaintainOrderList.ASMTG.TG014;
        this.MaintainOrderList.ASMTP.TP007 = this.MaintainOrderList.ASMTG.TG015;
        this.MaintainOrderList.ASMTP.TP008 = this.MaintainOrderList.ASMTG.TG016;
        this.MaintainOrderList.ASMTP.TP009 = this.MaintainOrderList.ASMTG.TG017;
        this.MaintainOrderList.ASMTP.TP011 = this.MaintainOrderList.ASMTG.TG020;
        this.MaintainOrderList.ASMTP.TP021 = this.MaintainOrderList.ASMTG.TG003;
        this.MaintainOrderList.ASMTP.TP029 = this.MaintainOrderList.ASMTG.TG003.substring(0, 6);
        this.MaintainOrderList.outsourcematain.forEach(x => {
          x.TQ001 = this.MaintainOrderList.ASMTP.TP001;
          x.TQ002 = this.MaintainOrderList.ASMTP.TP002;
          x.TQ004 = this.MaintainOrderList.ASMTG.TG006;
          x.TQ005 = this.MaintainOrderList.ASMTG.TG001;
          x.TQ006 = this.MaintainOrderList.ASMTG.TG002;
          x.TQ007 = x.TQ003;
        });
        break;
    }
    this.MaintainOrderList.maintaindetail.forEach(x => {
      x.TH001 = this.MaintainOrderList.ASMTG.TG001;
      x.TH002 = this.MaintainOrderList.ASMTG.TG002;
      x.TH022 = "N10";
      x.TH023 = this.matainrequest.ASMTA002;
      x.TH024 = x.TH003;
    });

  }
  SyncPrice() {
    this.MaintainOrderList.outsourcematain.forEach(x => {
      x.TQ010 = x.UDF06 * x.UDF07;
      x.TQ011 = x.TQ010;
      x.TQ012 = x.TQ010 * this.MaintainOrderList.ASMTG.TG015;
      x.TQ013 = x.TQ010 / this.MaintainOrderList.ASMTG.TG017;
      x.TQ014 = x.TQ013 * this.MaintainOrderList.ASMTG.TG015;
    });

  }
  ModifyDetail() {
    this.spinnerService.show();
    const request: ModifyMatainorderRequest = {
      MaintainOrderList: this.MaintainOrderList
    }
    this.rest.apiModifyMatainorder(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage('更新成功')
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  updateDetail() {
    this.MaintainOrderSync();
    this.FormValidation();
    if (this.Validation == 1) {
      this.spinnerService.show();
      const request: UpdateMaintainOrderRequest = {
        MaintainOrderList: this.MaintainOrderList
      }
      this.rest.apiUpdateMaintainOrder(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.ASMTG002 = res.ASMTG002;
          this.TotalCount = res.TotalCount;
          this.rest.successMessage('儲存成功');
          this.MaintainOrderSync();
          this.spinnerService.hide();
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        })
      ).subscribe();
    }
  }
  FormValidation() {
    var man = this.MaintainOrderList;
    if (man.ASMTG.TG001 == "N20") {
      if (
        man.ASMTG.TG003 != "" &&
        man.ASMTG.TG008 != "" &&
        man.ASMTG.TG010 &&
        man.ASMTG.TG011 &&
        man.ASMTN.TN001 != "" &&
        man.inhousementain.every(x => x.TO008 != "") &&
        man.maintaindetail.every(x => x.TH004 != "" && x.TH006 != "" && x.TH007 != "")
      ) { this.Validation = 1; } else { this.Validation = 2; }
    } else if (man.ASMTG.TG001 == "N21") {
      if (
        man.ASMTG.TG003 != "") {
        this.Errmsg = "開單日期未填寫";
        this.Validation = 1;
      }
      else if (man.ASMTG.TG008 != "") {
        this.Errmsg = "資產編號未填寫";
        this.Validation = 1;
      }
      else if (man.ASMTG.TG012 != "") {
        this.Errmsg = "保修廠商未填寫";
        this.Validation = 1;
      }
      else if (man.ASMTP.TP001 != "") {
        this.Errmsg = "保修單身TP001異常";
        this.Validation = 1;
      }
      else if (man.ASMTP.TP004 != "") {
        this.Errmsg = "保修單身TP004異常";
        this.Validation = 1;
      }
      else if (man.outsourcematain.every(x => x.TQ008 != "")) {
        this.Errmsg = "處理代號未填寫";
        this.Validation = 1;
      }
      else if (man.maintaindetail.every(x => x.TH004 != "" && x.TH006 != "" && x.TH007 != "")) {
        this.Validation = 1;
        this.Errmsg = "保修代號、原因或解決方法未填寫";
      }
      else { this.Validation = 2; }
    } else { this.Validation = 2; }
  }




}
function DatetoyyyyMMdd(newdate: Date) {

  var formatedate = new Date(newdate);
  if (formatedate != null) {
    var year = formatedate.getFullYear().toString();
    var month = (formatedate.getMonth() + 1).toString();
    while (month.length < 2) {
      month = "0" + month;
    }
    var odate = formatedate.getDate().toString();
    while (odate.length < 2) {
      odate = "0" + odate;
    }
    var yyyyMMdd = year + month + odate;
  }
  return yyyyMMdd;
}


function StringToDate(Text: string) {
  var newdate = new Date();
  newdate.setFullYear(Number(Text.substr(0, 4)));
  newdate.setMonth(Number(Text.substr(4, 2)) - 1);
  newdate.setDate(Number(Text.substr(6, 2)));
  return newdate;
}


function IsBlankorEmpty(Text: string) {
  if (Text != null && Text != "") {
    return true;
  }
  else {
    return false;
  }

}
