import { error } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NgxSpinnerService } from 'ngx-spinner/lib/ngx-spinner.service';
import { SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SelectOptions } from 'src/app/interface/selectOptions';
import { CalculateLineProductionRequest } from 'src/bin/calculateLineProductionRequest';
import { CalculateLineProductionResponseResult } from 'src/bin/calculateLineProductionResponseResult';
import { LineProductionScheduleListRequest } from 'src/bin/lineProductionScheduleListRequest';
import { LockOrderScheduleRequest } from 'src/bin/lockOrderScheduleRequest';
import { QueryProductionLineReqeust } from 'src/bin/queryProductionLineReqeust';
import { TransSchToERPRequest } from 'src/bin/transSchToErp';

@Component({
  selector: 'app-scheduleManagement',
  templateUrl: './scheduleManagement.component.html',
  styleUrls: ['./scheduleManagement.component.css']
})
export class ScheduleManagementComponent implements OnInit {
  theadList: Array<string> = [];
  lineCodeList: Array<SelectOptions> = [];
  tableData: Array<CalculateLineProductionResponseResult> = [];
  account: string = this.session.retrieve(LoginSessionEnum.UserAccount);
  fakeData: Array<CalculateLineProductionResponseResult> = [];
  pageSwitch: boolean = false;
  pouringDateStart: string;
  pouringDateEnd: string;
  workOrder:string;
  partNo:string;
  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private rest: ProdutionService,
    private route: ActivatedRoute,
    private sessionSt: SessionStorageService,
  ) { }

  ngOnInit() {
    this.theadList = ['操作', '客戶簡稱', '訂單單別-單號', '預計出貨日', '製令單單別-單號', '單重', '品號', '品名', '預計完成日'//, '鐵斗編號'
      , '木模日期', '造模組別', '造模日期', '合模組別', '合模日期', '澆注日期', '拆箱日期', '退火日期', '去毛邊日期', '噴漆日期', '暫存區日期', '送澄倡日期'];
    this.pouringDateStart = new Date().toISOString().slice(0, 10);
    this.pouringDateEnd = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10);
    this.spinnerService.show();
    this.sessionSt.store("scheduleManagementName", "scheduleManagement");
    this.workOrder = this.route.snapshot.queryParams["workOrder"];
    this.partNo = this.route.snapshot.queryParams["partNo"];
    this.getProductionLineList().pipe(
      switchMap(() => {
        this.spinnerService.hide();
        return this.getLineProductionScheduleList()
      })
    ).subscribe();
  }
  reloadPage(){
    this.pageSwitch = false;
    this.spinnerService.show();
    this.getLineProductionScheduleList().subscribe(data =>{
      this.spinnerService.hide();
    });
  }
  /**
   *取得計算後的列表
   *
   * @return {*}
   * @memberof ScheduleManagementComponent
   */
  getProductionLineList() {
    this.spinnerService.show();
    const request: QueryProductionLineReqeust = {
      Account: this.account,
      WorkOrder: this.workOrder
    }
    return this.rest.apiQueryProductionLine(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.lineCodeList = [{ name: '全部', value: '' }];
        res.LineCodeList.forEach((i) => {
          this.lineCodeList.push({
            name: i.ProductiongLineName,
            value: i.ProductionLineCode
          })
        });
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }

  // getCalculateLineProduction(thisWorkOrder?: string) {
  //   this.spinnerService.show();
  //   const request: CalculateLineProductionRequest = {
  //     account: this.account,
  //     thisWorkOrder: thisWorkOrder ? thisWorkOrder : ''
  //   }
  //   return this.rest.apiCalculateLineProduction(request).pipe(
  //     tap(res => {
  //       if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
  //         throw (res.ErrorMsg)
  //       }
  //       this.spinnerService.hide();
  //     }),
  //     catchError((res) => {
  //       this.rest.errorWithErrorMsg(res);
  //       this.spinnerService.hide();
  //       return of()
  //     }),
  //     switchMap(() => {
  //       return this.getLineProductionScheduleList()
  //     })
  //   ).subscribe();
  // }

  transERP(){
    this.spinnerService.show();
    this.transSchDataToERP().subscribe();
  }

  transSchDataToERP(){
    const request:TransSchToERPRequest = {
      Account:this.account,
      StartDate:this.pouringDateStart,
      EndDate:this.pouringDateEnd
      //DataTranstToErp:this.tableData
    };

    return this.rest.apiUpdateScheduleERP(request).pipe(
      tap(res=>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        const successMessage = res.WorkStatus == "OK" ? '執行成功' : '執行失敗';
        this.rest.successMessage(successMessage);
        this.spinnerService.hide();
      }),
      catchError((res) =>{
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  /**
   *取得列表
   *
   * @return {*}
   * @memberof ScheduleManagementComponent
   */
  getLineProductionScheduleList() {
    const request: LineProductionScheduleListRequest = {
      Account: this.account,
      pouringDateStart: this.pouringDateStart.split('-').join(''),
      pouringDateEnd: this.pouringDateEnd.split('-').join(''),
      WorkOrder:this.workOrder,
      PartNo:this.partNo
    }
    console.log(this.formatDate(new Date(Date.now())).replace('[','').replace(']',''));
    this.spinnerService.show();
    return this.rest.apiLineProductionScheduleList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.tableData = res.result.map((i) => {
          console.log(parseInt(i.patternStartDay));
          return {
            ...i,
            isOverCapacity: (i.isOverCapacity == '1'),
            isOverDue: parseInt(i.patternStartDay) < parseInt(this.formatDate(new Date(Date.now())).replace('[','').replace(']','')),
            toolTipString:"客戶簡稱:"+i.customerAlias+" 訂單號:" + i.orderNumber + " 預計出貨日:" + i.EstimatedTargetDay + " 製令單號:" + i.workOrderNumber + " 單重:"+i.workOrderWeight + " 品號:" + i.PartNo
          }
        });
        console.log(this.tableData)
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `\[${year}${month}${day}]`;
  }
  /**
   *判斷是否為日期 給予表格不同格式
   *
   * @param {string} colName
   * @return {*}  {boolean}
   * @memberof ScheduleManagementComponent
   */
  dateCols(colName: string): boolean {
    return colName.includes('日期')
  }

  switch(item: CalculateLineProductionResponseResult) {
    const request: LockOrderScheduleRequest = {
      workOrderHead: item.workOrderNumber.split('-')[0],
      workOrder: item.workOrderNumber.split('-')[1]
    }
    this.rest.apiLockOrderSchedule(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        const successMessage = item.isLocked ? '解鎖成功' : '鎖定成功';
        this.rest.successMessage(successMessage);
        this.spinnerService.hide()
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      switchMap(() => {
        return this.getLineProductionScheduleList()
      })
    ).subscribe();
  }
}
