import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-schedule-management-vice',
  templateUrl: './schedule-management-vice.component.html',
  styleUrls: ['./schedule-management-vice.component.css']
})
export class ScheduleManagementViceComponent implements OnInit {

  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private rest: ProdutionService,
    private route: ActivatedRoute,
    private sessionSt: SessionStorageService) { }
  pageSwitch: boolean = false;
  account: string = this.session.retrieve(LoginSessionEnum.UserAccount);
  tableData: Array<CalculateLineProductionResponseResult> = [];
  pouringDateStart: string;
  pouringDateEnd: string;
  workOrder:string;
  partNo:string;
  lineCodeList: Array<SelectOptions> = [];
  theadList: Array<string> = [];
  ngOnInit(): void {
    this.theadList = ['操作', '客戶簡稱', '訂單單別-單號', '預計出貨日', '製令單單別-單號', '單重', '品號', '品名', '預計完成日'//, '鐵斗編號'
      , '木模日期', '造模組別', '造模日期', '合模組別', '合模日期', '澆注日期', '拆箱日期', '退火日期', '去毛邊日期', '噴漆日期', '暫存區日期', '送澄倡日期'];
    this.pouringDateStart = new Date().toISOString().slice(0, 10);
    this.pouringDateEnd = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10);
    this.spinnerService.show();
    this.sessionSt.store("scheduleManagementName", "scheduleManagementVice");
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
   *   o p  �? C
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
        this.lineCodeList = [{ name: '    ', value: '' }];
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

  getCalculateLineProduction(thisWorkOrder?: string) {
    this.spinnerService.show();
    const request: CalculateLineProductionRequest = {
      account: this.account,
      thisWorkOrder: thisWorkOrder ? thisWorkOrder : ''
    }
    return this.rest.apiCalculateLineProduction(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
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
        const successMessage = res.WorkStatus == "OK" ? '\u57f7\u884c\u6210\u529f' : '\u57f7\u884c\u5931\u6557';
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
   *   o C
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
      // this.partNo
      // queryLocked:true
    }
    this.spinnerService.show();
    return this.rest.apiLineLockedProductionScheduleList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.tableData = res.result.map((i) => {
          return {
            ...i,
            isOverCapacity: (i.isOverCapacity == '1'),
            isOverDue: parseInt(i.patternStartDay) < parseInt(this.formatDate(new Date(Date.now())).replace('[','').replace(']','')),
            toolTipString:"\u5ba2\u6236\u7c21\u7a31:"+i.customerAlias+" \u8a02\u55ae\u865f:" + i.orderNumber + " \u9810\u8a08\u51fa\u8ca8\u65e5:" + i.EstimatedTargetDay + " \u88fd\u4ee4\u55ae\u865f:" + i.workOrderNumber + " \u55ae\u91cd:"+i.workOrderWeight + " \u54c1\u865f:" + i.PartNo
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
   * P _ O _            �? P �?
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
        const successMessage = item.isLocked ? '\u89e3\u9396\u6210\u529f' : '\u9396\u5b9a\u6210\u529f';
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
