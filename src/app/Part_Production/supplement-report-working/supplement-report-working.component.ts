import { format } from 'url';
import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeZhTw from '@angular/common/locales/zh-Hant';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProcessData } from 'src/app/Model/production';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service';
import { UpdateSFCRequest } from 'src/bin/updateSFCRequest';
import { WorkingDataRequest } from 'src/bin/workingDataRequest';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-supplement-report-working',
  templateUrl: './supplement-report-working.component.html',
  styleUrls: ['./supplement-report-working.component.css']
})

export class SupplementReportWorkingComponent implements OnInit {

  constructor( private route: ActivatedRoute,
    public rest: ProdutionService,
    private session:SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private sweetAlertService: SweetAlertService,
    private sessionSt: SessionStorageService,) {
      registerLocaleData(localeZhTw, 'zh-TW');
    }
  UserCode:string;
  WorkOrder:string;
  workerNumber:string;//工作人員工號
  workerNUmberList:string[] = [];
  step:string = "0";
  OrderDate:string = "";
  currentBottomFlask:string = "";
  now_d = new Date();
  // StartDate:string = this.now_d.getFullYear().toString()+'-'+this.now_d.getMonth().toFixed(2)+'-'+this.now_d.getDay().toFixed(2);//, 'yyyyMMdd', 'zh-Hant-TW', '+0800');
  // EndDate:string = '';//formatDate(new Date(), 'yyyyMMdd', 'zh-Hant-TW', '+0800');
  // hasScheData:boolean = false;
  // hasProcData:boolean = false;
  Schedule: any;
  SelectProcess: ProcessData = new ProcessData();
  Processlist: Array<ProcessData> = new Array<ProcessData>();
  PorductionOrderHead:string;
  PorductionOrder:string;
  Sequence :number= 0;
  WIPProcessCode:string;
  addWorkerNum()
  {
    var duplicate = this.workerNUmberList.filter((i, idx: number) => i == this.workerNumber);
    if (duplicate.length == 0)
    {
      this.workerNUmberList.push(this.workerNumber);
    }
    this.workerNumber = '';
  }
  checkWorkerNumber(WorkerNumber:string){
    if(this.workerNumber.trim() == ''){
      this.rest.errorWithErrorMsg(`請輸入工號`);
      return;
    }
    this.rest.apiCheckWorkerNumber(WorkerNumber).pipe(
      tap(res=>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        if(res.IsExist){
          this.addWorkerNum();
        }
        else
        {
          this.rest.errorWithErrorMsg(`工號：${this.workerNumber}不存在或已離職`)
          this.workerNumber = '';
        }
      }),
      catchError((res)=>{
        this.rest.errorWithErrorMsg(res);
        this.workerNumber = '';
        // this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  ngOnInit(): void {
    // this.StartDate = this.now_d.getFullYear().toString()+'-'+this.now_d.getMonth().toFixed(2)+'-'+this.now_d.getDay().toFixed(2);
    // this.EndDate = this.now_d.getFullYear().toString()+'-'+this.now_d.getMonth().toFixed(2)+'-'+this.now_d.getDay().toFixed(2);
  }
  NextStep(){
    if (this.step == "1"){
      this.spinnerService.show();
      const requestWorkingData: WorkingDataRequest = {
        PorductionOrderHead: this.PorductionOrderHead,
        PorductionOrder: this.PorductionOrder,
        Sequence: this.Sequence,
        WIPProcessCode: this.WIPProcessCode
      }
      this.rest.apiWorkingData(requestWorkingData).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.Schedule = res.WorkingData;
          this.spinnerService.hide();
          this.step = "2";
          // this.Loading = false;
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          // this.Loading = false;
          return of()
        })
      ).subscribe();
    }
  }
  PreviousStep() {
    var stepNum = parseInt(this.step) - 1;
    this.step = stepNum.toString();
    // this.workerNUmberList = [];
  }
  ProcessChange(){
    this.SelectProcess = this.Processlist.filter(x => x.WIPProcessCode == this.WIPProcessCode)[0];
  }
  query():void{
    // this.Loading = true;
    this.spinnerService.show();
    this.PorductionOrderHead = this.WorkOrder.split('-')[0];
    this.PorductionOrder =  this.WorkOrder.split('-')[1];
    this.rest.API_ReportWorkingData(this.PorductionOrderHead, this.PorductionOrder).then(
      (data) => {
        this.Processlist = data["ProcessData"];
        this.step = "1";
        // console.log("this.UserCode:"+this.UserCode);
      }
    ).finally(() => {  this.spinnerService.hide();});
  }
  DateFormat(date) {
    date = new Date(date);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }
  exportDefaultRepWork() {
    this.rest.apiExportDefaultRepWork().pipe().subscribe();
  }
  Transfer(type) {
    // this.Loading = true;
    var iscontinue = true;
    if (this.SelectProcess.WIPProcessCode.startsWith('08'))
    {
      if (this.workerNUmberList.length == 0)
      {
        if (this.Schedule.WIPProcessStatus=='N'&& this.Schedule.InStationQty<this.Schedule.PlanQTY)
        {
          this.rest.alertWithMessage('磨毛邊工站請輸入協作人員工號');
          return;
        }
      }
    }
    // 跟上次輸入的鐵斗做比對
    if (this.Schedule.PartDesc.indexOf("-消") == -1 && (this.WIPProcessCode.startsWith("03") || this.WIPProcessCode.startsWith("05")) && this.Schedule.BottomFlask != this.currentBottomFlask)
    {
      var message = '';
      if (this.WIPProcessCode.startsWith("03")){
        message = '合模維護的下模編號與造模維護的編號不同，是否要更新?';
      }
      else if (this.WIPProcessCode.startsWith("05")){
        message = '維護的下模編號與合模維護的編號不同，是否要更新?';
      }
      this.sweetAlertService.confirm({
        title: '確認',
        text: message,
        icon: 'warning'
      }).then((data) => {
        if (!data.isConfirmed) {
          // this.Loading = false;
          return;
        }
        else
        {
          //更新鐵斗
          if (this.SelectProcess.WIPProcessType == '造模') {
            var updateflaskresult;
            this.rest.API_UpdateScheduleFlask(this.PorductionOrderHead, this.PorductionOrder, this.Schedule.TopFlask, this.Schedule.BottomFlask, this.WIPProcessCode, this.UserCode).then(
              (data) => {
                updateflaskresult = data;
              }
            )
          }
          let date = this.OrderDate == "" ? this.DateFormat(new Date()).replace(/-/g, '') : this.OrderDate.replace(/-/g, '');
          this.UserCode = this.sessionSt.retrieve(LoginSessionEnum.UserAccount);
          let Quantity = this.Sequence == 0 ? this.Schedule.PlanQTY : 1;
          //有拆單的一次一個
          if (this.Sequence != 0) {
            Quantity = 1;
          }
          const request: UpdateSFCRequest = {
            Type: type,
            UserCode: this.UserCode,
            ProductionOrderHead: this.PorductionOrderHead,
            ProductionOrder: this.PorductionOrder,
            Sequence: this.Sequence,
            WIPProcessCode: this.WIPProcessCode,
            TransferDate: date,
            Quantity: Quantity,
            FlaskID: this.Schedule.TopFlask,
            BottomFlaskID: this.Schedule.BottomFlask,
            WorkNumberList:this.workerNUmberList,
            isSupplemental:true,
          };
          const requestWorkingData: WorkingDataRequest = {
            PorductionOrderHead: this.PorductionOrderHead,
            PorductionOrder: this.PorductionOrder,
            Sequence: this.Sequence,
            WIPProcessCode: this.WIPProcessCode
          }
          // this.Loading = true;
          this.rest.apiUpdateSFC(request).pipe(
            tap(res => {
              if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
                throw (res.ErrorMsg)
              }
            }),
            catchError((res) => {
              this.rest.errorWithErrorMsg(res);
              // this.Loading = false;
              return of()
            }),
            switchMap(() => {
              return this.rest.apiWorkingData(requestWorkingData)
            }),
            tap(res => {
              if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
                throw (res.ErrorMsg)
              }
              this.Schedule = res.WorkingData;
              // this.Loading = false;
              this.rest.successMessage('成功')
            })
          ).subscribe();
        }
      })
    }
    else
    {
      //更新鐵斗
      if (this.SelectProcess.WIPProcessType == '造模') {
        var updateflaskresult;
        this.rest.API_UpdateScheduleFlask(this.PorductionOrderHead, this.PorductionOrder, this.Schedule.TopFlask, this.Schedule.BottomFlask, this.WIPProcessCode, this.UserCode).then(
          (data) => {
            updateflaskresult = data;
          }
        )
      }
      let date = this.OrderDate == "" ? this.DateFormat(new Date()).replace(/-/g, '') : this.OrderDate.replace(/-/g, '');

      let Quantity = this.Sequence == 0 ? this.Schedule.PlanQTY : 1;
      //有拆單的一次一個
      if (this.Sequence != 0) {
        Quantity = 1;
      }
      this.UserCode = this.sessionSt.retrieve(LoginSessionEnum.UserAccount);

      const request: UpdateSFCRequest = {
        Type: type,
        UserCode: this.UserCode,
        ProductionOrderHead: this.PorductionOrderHead,
        ProductionOrder: this.PorductionOrder,
        Sequence: this.Sequence,
        WIPProcessCode: this.WIPProcessCode,
        TransferDate: date,
        Quantity: Quantity,
        FlaskID: this.Schedule.TopFlask,
        BottomFlaskID: this.Schedule.BottomFlask,
        WorkNumberList:this.workerNUmberList,
        isSupplemental:true,
      };
      const requestWorkingData: WorkingDataRequest = {
        PorductionOrderHead: this.PorductionOrderHead,
        PorductionOrder: this.PorductionOrder,
        Sequence: this.Sequence,
        WIPProcessCode: this.WIPProcessCode
      }
      // this.Loading = true;
      this.rest.apiUpdateSFC(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          // this.Loading = false;
          return of()
        }),
        switchMap(() => {
          return this.rest.apiWorkingData(requestWorkingData)
        }),
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.Schedule = res.WorkingData;
          // this.Loading = false;
          this.rest.successMessage('成功')
        })
      ).subscribe();
    }
  }
}
