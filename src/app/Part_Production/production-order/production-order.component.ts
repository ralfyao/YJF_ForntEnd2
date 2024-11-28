import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, AfterViewInit  } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { POMOCTAPUR, POstatus, MainProductionOrder, CoreProductionOrder } from 'src/app/Model/production';
import { DOCUMENT } from '@angular/common';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { RemoveScheduleTableRequest } from 'src/bin/removeScheduleTableRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CoreProductionListRequest } from 'src/bin/coreProductionListRequest';
import { ProductionOrderListRequest } from 'src/bin/productionOrderListRequest';
import { POMOCTAPURCheckListRequest } from 'src/bin/pOMOCTAPURCheckListRequest';
import { SplitOrderListRequest } from 'src/bin/splitOrderListRequest';
import { InsertScheduleTableRequest } from 'src/bin/insertScheduleTableRequest';
import { SinglePOStatusListByPartNoRequest } from 'src/bin/singlePOStatusListByPartNoRequest';
import { UpdateProductionOrderPrintCountRequest } from 'src/bin/updateProductionOrderPrintCountRequest';
import { environment } from 'src/environments/environment';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-production-order',
  templateUrl: './production-order.component.html',
  styleUrls: ['./production-order.component.css'],
})

export class ProductionOrderComponent implements OnInit {
  @ViewChild('todotable') todotable: any;
  @ViewChild('donetable') donetable: any;
  todo: Array<MainProductionOrder> = new Array<MainProductionOrder>();
  done: Array<MainProductionOrder> = new Array<MainProductionOrder>();
  //template: ` <ejs-barcodegenerator style="display: block;" #barcode id="barcode" width="200px" height="150px"mode="SVG" type="Code39" value="SYNCFUSION"></ejs-barcodegenerator>`;
  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount)

  SelectedTodo: Array<MainProductionOrder> = new Array<MainProductionOrder>();
  SelectedDone: Array<MainProductionOrder> = new Array<MainProductionOrder>();

  TodoSelectLine: string = '全部';
  SearchLabel: string = 'ItemCode';
  SearchText: string = '';
  TodoStartDate: string = '';
  TodoEndDate: string = '';
  InsertDate: string = DateFormat(new Date());

  DoneSelectLine: string = '全部';
  DoneSelectDate: string = '';
  DoneSearchLabel: string = 'ItemCode';
  DoneSearchText: string = '';

  LineList: Array<string> = new Array<string>();//生產線別清單
  StateList: Array<string> = new Array<string>();//生產進度清單
  CoreLineList: Array<string> = new Array<string>();//砂心線別清單


  Loadingcount: number = 0;
  EndLoadingcount: number = 0;

  CurrentPOstatus: POstatus = new POstatus();



  POMOCPURList: Array<POMOCTAPUR> = new Array<POMOCTAPUR>();

  QrcodeUrl: string = 'https://mail.yjfcasting.com:8013/';
  //QrcodeUrl: string ='http://localhost:4200/'//測試用
  printItem: any = new MainProductionOrder;
  printType: string = "";
  //#region 製令單印製
  printdata: Array<MainProductionOrder> = new Array<MainProductionOrder>();

  CustumerSelected: string;
  ProductionOrderSelected: string;
  StartdaySelected: string;
  EnddaySelected: string;
  ProductionSelected: string = '全部';//生產線別
  StateSelected: string = '全部';//生產進度


  printProductionOrder: Array<MainProductionOrder> = [];
  //#endregion
  //#region 砂心製令單
  coredata: Array<CoreProductionOrder> = new Array<CoreProductionOrder>();
  coreprintdata: Array<CoreProductionOrder> = new Array<CoreProductionOrder>();

  CoreCustumerSelected: string;
  CoreProductionOrderSelected: string;
  CoreStartdaySelected: string;
  CoreEnddaySelected: string;
  CoreProductionSelected: string = '全部';
  printCoreProductionOrder: Array<CoreProductionOrder> = [];
  //#endregion

  //#region 後處理拆單
  splitdata: Array<any> = [];
  printSplitOrder: Array<any> = [];
  SplitOrderSelected: Array<any> = [];

  SplitCustumerSelected: string;
  SplitProductionOrderSelected: string;
  SplitStartdaySelected: string;
  SplitEnddaySelected: string;

  SplitSequence: number = 0;


  //#endregion
  constructor(
    @Inject(DOCUMENT) private document,
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal,
    private sweetAlertService: SweetAlertService,
    public changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.GetMOCTAList().pipe(
      switchMap(() => {
        return this.CallPOMOCTAPURCheckList()
      }),
      switchMap(() => {
        return this.GetCoreList()
      }),
      switchMap(() => {
        return this.GetSplitOrderList()
      })
    ).subscribe();
  }


  CallPOMOCTAPURCheckList() {
    this.spinnerService.show();
    const request: POMOCTAPURCheckListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiPOMOCTAPURCheckList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.POMOCPURList = res.POMOCTAPURCheckList;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }
  // ngAfterViewInit(head:string, order:string) {
  //   JsBarcode("#barcode", head+"-"+order, {
  //     format: "CODE39",
  //     lineColor: "#000",
  //     width: 6,
  //     height: 40,
  //     displayValue: true
  //   });
  // }
  GetMOCTAList() {
    this.spinnerService.show();
    const request: ProductionOrderListRequest = {
      Account: this.UserAccount,
      QueryFlaskInfo:false,
      QueryScheduleDate:false
    }
    return this.rest.apiProductionOrderList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.done = res.ScheduleTableList;
        const result = res.OrderList;
        res.OrderList.forEach(x => {
          if (x.MoldingLineName != '' && x.MoldingLineName != null && x.AsemblingLineName != '' && x.AsemblingLineName != null) {
            if (!this.LineList.includes(x.MoldingLineName)) {
              this.LineList.push(x.MoldingLineName);
            }
            if (!this.LineList.includes(x.AsemblingLineName)) {
              this.LineList.push(x.AsemblingLineName);
            }
          }
        });
        this.todo = result.filter(x => x.ProductionOrderStatus == "1");
        this.todo = this.todo.sort((a, b) => a.ProductionOrderCode.localeCompare(b.ProductionOrderCode));
        this.StateList = Array.from(new Set(this.done.map(item => item.ProductionState))).sort();
        this.StateList.push('全部');
        this.LineList.push('全部');
        this.updatePrintdataFilter();
        this.LineList = this.LineList.sort((a, b) => a.localeCompare(b));
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }), tap(() => {
        this.spinnerService.hide();
      })
    );
  }

  getRowClass(row) {

    return {
      'hasDefect': row.DefectDetail.length > 0
    };
    ;
  }
  getDetailHeight(row) {
    if (!row) {
      return 40;
    }
    /*  switch (row['DefectDetail'].length) {
       case 0:
         return 40

       case 1:
         return 80

       case 2:
         return 100

       default:
         return 120
     } */
  }



  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  InsertDoneList() {
    if (!this.SelectedTodo.length) {
      this.spinnerService.hide();
      this.rest.errorWithErrorMsg('未選擇工單');
      return
    }
    this.SelectedTodo.forEach(x => {
      x.SchedulingDate = this.InsertDate.replace(/-/g, '');
    });
    const resquest: InsertScheduleTableRequest = {
      Account: this.UserAccount,
      InserScheduleRange: this.SelectedTodo
    }
    this.rest.apiInsertScheduleTable(resquest).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage('新增成功');
        this.todo = this.todo.filter(x => !this.SelectedTodo.includes(x));
        this.SelectedTodo.forEach(x => this.done.push(x));
        this.SelectedTodo = this.SelectedTodo.map(e => e);
        this.SelectedTodo = new Array<MainProductionOrder>();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      switchMap(() => {
        return this.GetCoreList()
      }),
      tap(() => {
        this.updatePrintdataFilter();
      })
    ).subscribe();
  }

  async RemoveFromDoneList() {
    if (!this.SelectedDone.length) {
      this.rest.errorWithErrorMsg('未選擇排程')
      return
    }
    this.spinnerService.show();
    const request: RemoveScheduleTableRequest = {
      Account: this.UserAccount,
      InserScheduleRange: this.SelectedDone
    }
    this.rest.apiRemoveScheduleTable(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.done = this.done.filter(x => !this.SelectedDone.includes(x));
        this.SelectedDone.forEach(x => this.todo.push(x));
        this.spinnerService.hide();
        this.rest.successMessage('移除成功');
        this.SelectedTodo = this.SelectedTodo.map(e => e);
        this.todo = this.todo.sort((a, b) => a.ProductionOrderCode.localeCompare(b.ProductionOrderCode));
        this.SelectedDone = new Array<MainProductionOrder>();
        this.updatePrintdataFilter();
      }),
      switchMap(() => {
        return this.GetCoreList()
      }),
      tap(() => {
        this.updatePrintdataFilter();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  CheckToDoList() {
    let resultList: Array<MainProductionOrder> = new Array<MainProductionOrder>();
    if (this.todo.length == 0) {
      return resultList;
    }
    resultList = this.todo.filter(x =>
      (this.TodoStartDate.replace(/-/g, '') <= x.ETD || this.TodoStartDate == '') &&
      (this.TodoEndDate.replace(/-/g, '') >= x.ETD || this.TodoEndDate == '') &&
      (this.TodoSelectLine == '全部' || x.AsemblingLineName == this.TodoSelectLine || x.MoldingLineName == this.TodoSelectLine) &&
      x[this.SearchLabel].includes(this.SearchText));
    return resultList;
  }

  CheckDoneList() {
    let resultList: Array<MainProductionOrder> = new Array<MainProductionOrder>();
    resultList = this.done.filter(x =>
      (x.SchedulingDate == this.DoneSelectDate.replace(/-/g, '') || this.DoneSelectDate == '') &&
      (this.DoneSelectLine == '全部' || x.AsemblingLineName == this.DoneSelectLine || x.MoldingLineName == this.DoneSelectLine) &&
      x[this.DoneSearchLabel].includes(this.DoneSearchText)
    )

    return resultList;
  }

  WeightDisplay() {
    const newlist = this.CheckDoneList();
    if (newlist.length > 0) {
      return newlist.map(x => x.ProductWeight).reduce((a, b) => a + b);
    } else {
      return 0
    }

  }
  QuantityDisplay() {
    const newlist = this.CheckDoneList();
    if (newlist.length > 0) {
      return newlist.length;
    } else {
      return 0
    }
  }



  SelectPoStatus(item: MainProductionOrder) {
    this.spinnerService.show();
    const request: SinglePOStatusListByPartNoRequest = {
      Account: this.UserAccount,
      TA002: item.ProductionOrderCode.substring(0, 11)
    }
    this.rest.apiSinglePOStatusListByPartNo(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.CurrentPOstatus = res.POstatusList;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }



  CaculateFlask(CurrentPOstatus: POstatus) {
    return CurrentPOstatus.PatternLength * CurrentPOstatus.PatternWidth * (CurrentPOstatus.PatternUHeight + CurrentPOstatus.PatternDHeight) / 100000000
  }
  CheckQTY(Partno: string) {
    const list = this.POMOCPURList.filter(x => x.PartNo == Partno);
    if (list.length > 0) {
      return {
        OrderQTY: list[0].OrderQty,
        PurchaseQTY: list[0].PurchasingOrder,
        ProductionOrder: list[0].ProductionOrder,
        StockQTY: list[0].StockQty,
        SandCoreInfo: list[0].SandCoreInfo,
        FlaskQty: list[0].FlaskQty,
      }
    } else {
      return {
        OrderQTY: 0,
        PurchaseQTY: 0,
        ProductionOrder: 0,
        StockQTY: 0,
        SandCoreInfo: '',
        FlaskQty: 0,
      }
    }
  }
  CheckOrder(item: MainProductionOrder) {
    const Partno = item.ItemCode;
    const list = this.POMOCPURList.filter(x => x.PartNo == Partno);
    if (list.length > 0) {
      const orderqty = list[0].OrderQty - list[0].StockQty;
      if (orderqty > 0) {
        return 'white'
      } else {
        return 'lightgrey'
      }
    } else {
      return 'white'
    }
  }

  CheckDoneOrder(item: MainProductionOrder) {
    const Partno = item.ItemCode;
    const list = this.POMOCPURList.filter(x => x.PartNo == Partno);
    const productionqty = this.done.filter(x => x.ItemCode == item.ItemCode).map(x => x.BatchQTY).reduce((a, b) => a + b);

    if (list.length > 0) {
      const orderqty = list[0].OrderQty - list[0].StockQty;
      if (orderqty == 0) {
        return 'lightgrey'

      } else if (productionqty > orderqty) {
        return 'pink'
      }
      else {
        return 'white'
      }
    } else {
      return 'white'
    }
  }
  TodoToggleExpandRow(row) {
    this.todotable.rowDetail.toggleExpandRow(row);
  }
  DoneToggleExpandRow(row) {
    this.donetable.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  onSelect({ selected }, selectlist) {
    selectlist.splice(0, selectlist.length);
    selectlist.push(...selected);
  }


  //#region 製令單印製
  //製令單清單
  updatePrintdataFilter() {

    this.printdata = this.done.filter(x => (x.CustomerName.toLowerCase().indexOf(this.CustumerSelected) !== -1 || !this.CustumerSelected)
      && (x.ProductionOrderCode.toLowerCase().indexOf(this.ProductionOrderSelected) !== -1 || !this.ProductionOrderSelected)
      && (!this.StartdaySelected || x.SchedulingDate >= this.StartdaySelected.replace(/\-/g, ''))
      && (!this.EnddaySelected || x.SchedulingDate <= this.EnddaySelected.replace(/\-/g, ''))
      && (['全部', x.MoldingLineName, x.AsemblingLineName].includes(this.ProductionSelected))
      && (['全部', x.ProductionState].includes(this.StateSelected)));
  }
  onPrintSelect({ selected }) {
    this.printProductionOrder.splice(0, this.printProductionOrder.length);
    this.printProductionOrder.push(...selected);
  }
  //製令單匯出
  async downloadPDF() {
    this.spinnerService.show();
    if (this.printProductionOrder.length == 0) {
      this.sweetAlertService.alertFail({
        text: '未選擇製令單!!',
      });
      this.spinnerService.hide();
      return;
    }
    if (this.printProductionOrder.length > 50) {
      this.sweetAlertService.alertFail({
        text: '單次匯出數量不可超過50筆'
      });
      this.spinnerService.hide();
      return;
    }

    let PDF = new jsPDF('l', 'mm', 'b5'); // A4 size page of PDF
    let DATA = document.getElementById('printpdf');
    let img = DATA.getElementsByClassName('qrcodeimg')[0];
    DATA.style.display = "block";
    this.printType = 'main';
    for (let i = 0; i < this.printProductionOrder.length; i++) {
      try {
        this.printItem = this.printProductionOrder[i];
        this.printProductionOrder[i].PrintCount++;
        let todoProductionOrder = this.printProductionOrder[i].ProductionOrderCode;
        let todoProductionOrderHead = this.printProductionOrder[i].ProductionHeadCode;
        img.setAttribute('src', '');//先清空才不會印到前一個

        let webUrl = this.QrcodeUrl + 'report_working?PorductionOrderHead=' + todoProductionOrderHead + '&PorductionOrder=' + todoProductionOrder;
        let qrcodeurl = "";
        JsBarcode("#barcode", todoProductionOrderHead.trim()+"-"+todoProductionOrder, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 40,
          displayValue: false
        });
        await QRCode.toDataURL(webUrl).then(url => { qrcodeurl = url })
        img.setAttribute('src', qrcodeurl);
        this.changeDetectorRef.detectChanges();//更新畫面
        await html2canvas(DATA).then(canvas => {

          let fileWidth = 240;
          let fileHeight = canvas.height * fileWidth / canvas.width;
          const FILEURI = canvas.toDataURL('image/png')
          PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)

          if (i == (this.printProductionOrder.length - 1)) {
            PDF.save('製令單.pdf');
            this.sweetAlertService.alertSuccess({
              text: '製令單匯出成功'
            });
          } else {
            PDF.addPage();
          }

        }).catch(function (error) {
          DATA.style.display = "none";
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: '製令單匯出失敗!!',
          });
          console.log("Error ProductionOrder:" + todoProductionOrder, error);
          return;
        });
      } catch (error) {
        DATA.style.display = "none";
        this.spinnerService.hide();
        this.sweetAlertService.alertFail({
          text: '製令單匯出失敗!!'
        });
        console.log("Error Message:" + error);
        return;
      }
    }
    const request: UpdateProductionOrderPrintCountRequest = {
      PrintData: this.printProductionOrder
    }
    this.rest.apiUpdateProductionOrderPrintCount(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide()
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe(() => {
      DATA.style.display = "none";
    });
  }
  //打開報工頁
  OpenRepotrWorking(ProductionHeadCode, ProductionOrderCode) {
    window.open(this.QrcodeUrl + 'report_working?PorductionOrderHead=' + ProductionHeadCode + '&PorductionOrder=' + ProductionOrderCode)

  }
  //#endregion

  //#region 砂心製令單印製

  GetCoreList() {
    this.spinnerService.show();
    this.Loadingcount++;
    const request: CoreProductionListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiCoreProductionList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.coredata = res.CoreProductionOrderList;
        this.updateCorePrintdataFilter();
        this.CoreLineList = Array.from(new Set(this.coredata.map(x => x.CoreLineName)));
        this.CoreLineList.push('全部');
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.EndLoadingcount++;
      })
    )
  }
  //砂心製令單清單
  updateCorePrintdataFilter() {

    this.coreprintdata = this.coredata.filter(x =>
      (x.CustomerName.toLowerCase().indexOf(this.CoreCustumerSelected) !== -1 || !this.CoreCustumerSelected)
      && (x.ProductionOrderCode.toLowerCase().indexOf(this.CoreProductionOrderSelected) !== -1 || !this.CoreProductionOrderSelected)
      && (!this.CoreStartdaySelected || x.SchedulingDate >= this.CoreStartdaySelected.replace(/\-/g, ''))
      && (!this.CoreEnddaySelected || x.SchedulingDate <= this.CoreEnddaySelected.replace(/\-/g, ''))
      && (['全部', x.CoreLineName].includes(this.CoreProductionSelected)));
  }
  onCorePrintSelect({ selected }) {
    this.printCoreProductionOrder.splice(0, this.printCoreProductionOrder.length);
    this.printCoreProductionOrder.push(...selected);
  }
  //製令單匯出
  async downloadCorePDF() {
    this.spinnerService.show();
    if (this.printCoreProductionOrder.length == 0) {
      this.sweetAlertService.alertFail({
        text: '未選擇製令單!!'
      });
      this.spinnerService.hide();
      return;
    }
    if (this.printCoreProductionOrder.length > 50) {
      this.sweetAlertService.alertFail({
        text: '單次匯出數量不可超過50筆'
      });
      this.spinnerService.hide();
      return;
    }

    let PDF = new jsPDF('l', 'mm', 'b5'); // A4 size page of PDF
    let DATA = document.getElementById('printpdf');
    let img = DATA.getElementsByClassName('qrcodeimg')[0];
    DATA.style.display = "block";
    this.printType = 'core';
    for (let i = 0; i < this.printCoreProductionOrder.length; i++) {
      try {
        this.printItem = this.printCoreProductionOrder[i];
        this.printCoreProductionOrder[i].PrintCount++;
        let todoProductionOrder = this.printCoreProductionOrder[i].ProductionOrderCode;
        let todoProductionOrderHead = this.printCoreProductionOrder[i].ProductionHeadCode;
        img.setAttribute('src', '');//先清空才不會印到前一個

        let webUrl = this.QrcodeUrl + 'report_working?PorductionOrderHead=' + todoProductionOrderHead + '&PorductionOrder=' + todoProductionOrder;
        let qrcodeurl = "";
        await QRCode.toDataURL(webUrl).then(url => { qrcodeurl = url })
        img.setAttribute('src', qrcodeurl);
        this.changeDetectorRef.detectChanges();//更新畫面
        await html2canvas(DATA).then(canvas => {

          let fileWidth = 240;
          let fileHeight = canvas.height * fileWidth / canvas.width;
          const FILEURI = canvas.toDataURL('image/png')
          PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)

          if (i == (this.printCoreProductionOrder.length - 1)) {
            PDF.save('製令單.pdf');
            this.sweetAlertService.alertSuccess({
              text: '製令單匯出成功'
            });
          } else {
            PDF.addPage();
          }

        }).catch(function (error) {
          DATA.style.display = "none";
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: '製令單匯出失敗!!'
          });
          console.log("Error ProductionOrder:" + todoProductionOrder, error);
          return;
        });
      } catch (error) {
        DATA.style.display = "none";
        this.spinnerService.hide();
        this.sweetAlertService.alertFail({
          text: '製令單匯出失敗!!'
        });
        console.log("Error Message:" + error);
        return;
      }
    }
    DATA.style.display = "none";
    this.spinnerService.hide();
  }
  //#endregion

  //#region 後處理拆單

  GetSplitOrderList() {
    this.spinnerService.show();
    const request: SplitOrderListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiSplitOrderList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.splitdata = res.SplitOrderList;
        this.updateSplitPrintdataFilter();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.spinnerService.hide();
      })
    )
  }
  //後處理拆單清單
  updateSplitPrintdataFilter() {

    this.printSplitOrder = this.splitdata.filter(x =>
      (x.CustomerName.toLowerCase().indexOf(this.SplitCustumerSelected) !== -1 || !this.SplitCustumerSelected)
      && (x.ProductionOrderCode.toLowerCase().indexOf(this.SplitProductionOrderSelected) !== -1 || !this.SplitProductionOrderSelected)
      && (!this.SplitStartdaySelected || x.PouringFinishDate >= this.SplitStartdaySelected.replace(/\-/g, ''))
      && (!this.SplitEnddaySelected || x.PouringFinishDate <= this.SplitEnddaySelected.replace(/\-/g, '')));
  }
  //製令單匯出
  async downloadSplitPDF() {
    this.spinnerService.show();
    if (this.SplitOrderSelected.length == 0) {
      this.sweetAlertService.alertFail({
        text: '未選擇製令單!!'
      });
      this.spinnerService.hide();
      return;
    }
    if (this.SplitOrderSelected.length > 20) {

      this.sweetAlertService.alertFail({
        text: '單次匯出數量不可超過20筆'
      });
      this.spinnerService.hide();
      return;
    }

    let PDF = new jsPDF('l', 'mm', 'b5'); // A4 size page of PDF
    let DATA = document.getElementById('printpdf');
    let img = DATA.getElementsByClassName('qrcodeimg')[0];
    DATA.style.display = "block";
    this.printType = 'split';
    for (let i = 0; i < this.SplitOrderSelected.length; i++) {
      try {
        this.printItem = this.SplitOrderSelected[i];
        let todoProductionOrder = this.SplitOrderSelected[i].ProductionOrderCode;
        let todoProductionOrderHead = this.SplitOrderSelected[i].ProductionHeadCode;
        img.setAttribute('src', '');//先清空才不會印到前一個
        for (let Sequence = 0; Sequence < this.printItem.PlanQTY; Sequence++) {
          this.SplitSequence = Sequence + 1;
          let webUrl = this.QrcodeUrl + 'report_working?PorductionOrderHead=' + todoProductionOrderHead
            + '&PorductionOrder=' + todoProductionOrder
            + '&Sequence=' + this.SplitSequence;
          let qrcodeurl = "";
          await QRCode.toDataURL(webUrl).then(url => { qrcodeurl = url })
          img.setAttribute('src', qrcodeurl);
          this.changeDetectorRef.detectChanges();//更新畫面
          await html2canvas(DATA).then(canvas => {

            let fileWidth = 240;
            let fileHeight = canvas.height * fileWidth / canvas.width;
            const FILEURI = canvas.toDataURL('image/png')
            PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)

            if (i == (this.SplitOrderSelected.length - 1) && Sequence == (this.printItem.PlanQTY - 1)) {
              PDF.save('製令單.pdf');
              this.sweetAlertService.alertSuccess({
                text: '製令單匯出成功'
              });
            } else {
              PDF.addPage();
            }

          }).catch(function (error) {
            DATA.style.display = "none";
            this.spinnerService.hide();
            this.sweetAlertService.alertFail({
              text: '製令單匯出失敗!!'
            });
            console.log("Error ProductionOrder:" + todoProductionOrder, error);
            return;
          });
        }
      } catch (error) {
        DATA.style.display = "none";
        this.spinnerService.hide();
        this.sweetAlertService.alertFail({
          text: '製令單匯出失敗!!'
        });
        console.log("Error Message:" + error);
        return;
      }
    }
    DATA.style.display = "none";
    this.spinnerService.hide();
  }
  onSplitPrintSelect({ selected }) {
    this.SplitOrderSelected.splice(0, this.SplitOrderSelected.length);
    this.SplitOrderSelected.push(...selected);
  }

  //#endregion



  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }

  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}

function DateFormat(date) {
  date = new Date(date);
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return year + '-' + month + '-' + day;
}


function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length);
}



