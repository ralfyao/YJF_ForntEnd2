// import { *as$ } from 'jquery';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { ProcessData } from 'src/app/Model/production';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
import { UpdateSFCRequest } from 'src/bin/updateSFCRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { WorkingDataRequest } from 'src/bin/workingDataRequest';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-report-working',
  templateUrl: './report-working.component.html',
  styleUrls: ['./report-working.component.css']
})
export class ReportWorkingComponent implements OnInit {
  PorductionOrderHead: string = "";
  PorductionOrder: string = "";
  Sequence: number = 0;

  WIPProcessCode: string = "";
  Schedule: any;
  Processlist: Array<ProcessData> = new Array<ProcessData>();
  employeeProcess: Array<ProcessData> = new Array<ProcessData>();
  SelectProcess: ProcessData = new ProcessData();
  UserCode: string = "";
  StepNumber: number = 1;
  IsChoose: boolean = false;//是否選擇工序
  IsManager: boolean = false;//是否有特別權限
  IsHoldRelease: boolean = false;
  IsShowHoldRelease:boolean = true;
  Loading: boolean = false;
  workerNumber:string;//工作人員工號
  workerNUmberList:string[] = [];
  OrderDate: string = DateFormat(new Date());
  currentBottomFlask:string;
  ManagerList = new Array<string>();//報工特別權限
  GridData:any;//例外工時資料
  excpTypeAdd:string="1";//例外工時類別
  excpReasonAdd:string;//例外工時原因
  id:number;//例外工時資料ID
  IsShowHold: boolean = false;
  IsShowRelease: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public rest: ProdutionService,
    private session:SessionStorageService,
    private sweetAlertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    //獲取網址參數
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.PorductionOrderHead = params.PorductionOrderHead;
      this.PorductionOrder = params.PorductionOrder;
      this.currentBottomFlask = params.BottomFlask;
      if (params.Sequence) {
        this.Sequence = params.Sequence;
      }
    })
    this.GetFromData();
  }
  GetFromData() {
    this.Loading = true;
    this.rest.API_ReportWorkingData(this.PorductionOrderHead, this.PorductionOrder).then(
      (data) => {
        this.Processlist = data["ProcessData"];
        this.ManagerList = data['ManagerList'];
        console.log("this.UserCode:"+this.UserCode);
        console.log("this.Processlist",this.Processlist);
        this.workerNUmberList.push(this.UserCode)
      }
    ).finally(() => { this.Loading = false; });
  }
  ProcessChange() {
    this.SelectProcess = this.Processlist.filter(x => x.WIPProcessCode == this.WIPProcessCode)[0];
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

  addWorkerNum()
  {
    var duplicate = this.workerNUmberList.filter((i, idx: number) => i == this.workerNumber);
    if (duplicate.length == 0)
    {
      this.workerNUmberList.push(this.workerNumber);
    }
    this.workerNumber = '';
  }

  Transfer(type) {
    this.Loading = true;
    var iscontinue = true;
    // this.rest.apiQueryExceptionWorkHour({workOrder:this.PorductionOrderHead.trim() + '-' + this.PorductionOrder}).pipe(
    //   tap((res)=>{
    //     let data = res.result[0];
        // if (data){
        //   if (data.ExcpType == "1")
        //   {
        //     this.Loading = false;
        //     this.rest.errorWithErrorMsg("該製令已暫停");
        //     return;
        //   }
        //   if (data.ExcpType == "3")
        //   {
        //     this.Loading = false;
        //     this.rest.errorWithErrorMsg("該製令已報廢");
        //     return;
        //   }
        // }

        if (this.SelectProcess.WIPProcessCode.startsWith('08'))
          {
            if (this.workerNUmberList.length == 0)
            {
              if (this.Schedule.WIPProcessStatus=='N'&& this.Schedule.InStationQty<this.Schedule.PlanQTY)
              {
                this.sweetAlertService.alertFail({
                  text: '磨毛邊工站請輸入協作人員工號',
                });
                this.Loading = false;
                // this.rest.alertWithMessage('');
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
                this.Loading = false;
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
                let date = this.OrderDate == "" ? DateFormat(new Date()).replace(/-/g, '') : this.OrderDate.replace(/-/g, '');

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
                  isSupplemental:false,
                };
                const requestWorkingData: WorkingDataRequest = {
                  PorductionOrderHead: this.PorductionOrderHead,
                  PorductionOrder: this.PorductionOrder,
                  Sequence: this.Sequence,
                  WIPProcessCode: this.WIPProcessCode
                }
                this.Loading = true;
                this.rest.apiUpdateSFC(request).pipe(
                  tap(res => {
                    if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
                      throw (res.ErrorMsg)
                    }
                  }),
                  catchError((res) => {
                    this.rest.errorWithErrorMsg(res);
                    this.Loading = false;
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
                    this.Loading = false;
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
            let date = this.OrderDate == "" ? DateFormat(new Date()).replace(/-/g, '') : this.OrderDate.replace(/-/g, '');

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
              isSupplemental:false
            };
            const requestWorkingData: WorkingDataRequest = {
              PorductionOrderHead: this.PorductionOrderHead,
              PorductionOrder: this.PorductionOrder,
              Sequence: this.Sequence,
              WIPProcessCode: this.WIPProcessCode
            }
            this.Loading = true;
            this.rest.apiUpdateSFC(request).pipe(
              tap(res => {
                if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
                  throw (res.ErrorMsg)
                }
              }),
              catchError((res) => {
                this.rest.errorWithErrorMsg(res);
                this.Loading = false;
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
                this.Loading = false;
                this.rest.successMessage('成功')
              })
            ).subscribe();
        }
    //   }),
    //   catchError(res=>{
    //     this.rest.errorWithErrorMsg(res);
    //     this.Loading = false;
    //     return of()
    //   })
    // ).subscribe();

  }

  //上模異動跟下模同步
  FlaskIDChange() {
    this.Schedule.BottomFlask = this.Schedule.TopFlask
  }
  //下一步
  NextStep() {
    this.Loading = true;
    if (this.IsChoose == false) {
      if (this.UserCode.length == 0) {
        this.Loading = false;
        this.sweetAlertService.alertFail({
          text: "請輸入工號"
        });
        return;
      }
      if (this.ManagerList.includes(this.UserCode)) {
        this.IsChoose = true;
        this.IsManager = true;
        this.Loading = false;
        return;
      }
      this.rest.API_GetEmployeeDept(this.UserCode).then(
        (data) => {
          this.Loading = false;
          if (data["EmployeeInfo"] == null) {
            this.sweetAlertService.alertFail({
              text: "請輸入正確工號"
            });

            return;
          }
          this.employeeProcess = this.Processlist.filter(x => x.WIPProcessName.includes(data["EmployeeInfo"].DeptName) ||
            (data["EmployeeInfo"].DeptCode.substr(0, 2) == "P4" && x.WIPProcessType.trim() == "熔解") ||
            (data["EmployeeInfo"].DeptCode.substr(0, 2) == "P5" && x.ProductionLineCode.trim() == "1113"));
          if (this.employeeProcess.length == 0) {
            this.sweetAlertService.alertFail({
              text: "人員組別與該工單不符,請確認。"
            });
            return;
          } else if (this.employeeProcess.length == 1) {
            this.SelectProcess = this.employeeProcess[0];
            this.WIPProcessCode = this.SelectProcess.WIPProcessCode;
          } else {
            this.IsChoose = true;
            return;
          }
          console.log(this.UserCode);
          this.workerNUmberList.push(this.UserCode);
          this.StepNumber++;
          this.Schedule = '';
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
              this.Loading = false;
            }),
            catchError((res) => {
              this.rest.errorWithErrorMsg(res);
              this.Loading = false;
              return of()
            })
          ).subscribe();
        }
      )
    } else {
      if (this.WIPProcessCode == "") {
        this.sweetAlertService.alertFail({
          text: "請選擇工序!!"
        });
        this.Loading = false;
        return;
      }
      this.StepNumber++;
      this.Schedule = '';
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
          this.Loading = false;
          // console.log(this.UserCode);
          this.workerNUmberList.push(this.UserCode);
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.Loading = false;
          return of()
        })
      ).subscribe();
      return;
    }


  }

  PreviousStep() {
    this.StepNumber--;
    this.workerNUmberList = [];
  }

  HoldRelease(){
    this.IsHoldRelease = true;
    this.Loading = true;
    let queryParameter = {
      workOrder: this.PorductionOrderHead.trim()+'-'+this.PorductionOrder,
    };
    this.rest.apiQueryExceptionWorkHour(
      queryParameter
    ).pipe(
      tap((res) =>{
        this.Loading = false;
        this.GridData = res.result[0];
        if (this.GridData)
        {
          this.id = this.GridData.ID;
          console.log('this.id', this.id);
          this.excpReasonAdd = this.GridData.ExcpColumn;
          console.log('this.excpReasonAdd', this.excpReasonAdd);
          this.excpTypeAdd = this.GridData.ExcpType;
          console.log('this.excpTypeAdd', this.excpTypeAdd);
          if (!this.excpTypeAdd)
            this.excpTypeAdd = "2";
          if (this.GridData.ExcpType == "1")
          {
            this.IsShowHold = false;
            this.IsShowRelease = true;
          }
          if (this.GridData.ExcpType == "2" || this.GridData.ExcpType == "4")
          {
            this.IsShowHold = true;
            this.IsShowRelease = false;
          }
        }
        else
        {
          this.IsShowHold = true;
          this.IsShowRelease = false;
        }
        // this.IsShowHoldRelease = false;
      }),
      catchError(res =>{
        this.rest.errorWithErrorMsg(res);
          this.Loading = false;
          return of()
      })
    ).subscribe();
  }
  HoldReleaseTxn(){
    let now = new Date();
    let nowStr = formatDate(now, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    if (this.IsShowRelease && this.excpTypeAdd == "1")
    {
      this.excpTypeAdd = "2";
    }
    let addObj =  {
      Account:this.UserCode,
      id:this.id,
      workOrder: this.PorductionOrderHead.trim()+'-'+this.PorductionOrder,
      partNo: this.Processlist[0].PartNo,
      partDesc: this.Processlist[0].PartDesc,
      quantity: this.Processlist[0].Quantity,
      excpTime: nowStr,
      excpType: this.excpTypeAdd??"1",
      excpReason: this.excpTypeAdd == "1" ? this.excpReasonAdd : "",
    };
    if(!this.excpTypeAdd)
    {
      this.rest.errorWithErrorMsg('請選擇暫停或解除暫停/PLEASE SELECT EXCEPTION WORK HOUR TYPE');
      return;
    }
    console.log(addObj);
    this.Loading = true;
    this.rest.apiAddExceptionWorkHour(addObj).pipe(
      tap(res =>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage('執行成功');
        this.Loading = false;
        window.location.reload();
      }),
      catchError((rep) => {
        this.rest.errorWithErrorMsg(rep);
        this.Loading = false;
        return of()
      })
    ).subscribe();
  }
}
function DateFormat(date) {
  date = new Date(date);
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return year + '-' + month + '-' + day;
}
