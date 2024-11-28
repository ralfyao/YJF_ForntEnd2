import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { catchError, tap } from 'rxjs/operators';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { LoginService } from 'src/app/Service/login.service';
import { of } from 'rxjs';
import { WorkOrderMeta } from 'src/bin/workOrderMeta';
import { ReportWorkOrderMetaReq } from 'src/bin/reportWorkOrderMetaReq';
@Component({
  selector: 'app-post-process-rep-working',
  templateUrl: './post-process-rep-working.component.html',
  styleUrls: ['./post-process-rep-working.component.css']
})
export class PostProcessRepWorkingComponent implements OnInit {

  constructor(public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private loginService:LoginService,
    private renderer: Renderer2) { }
  StepNumber:number;
  UserCode:string;
  IsLogin:boolean;
  WorkOrder:string;
  GridData:WorkOrderMeta[] = [];
  _workOrder:string;
  _submittor:string;
  _inStationDate:string;
  _receiveFlag:string;
  singleWorkOrder:WorkOrderMeta;
  exist:boolean = false;
  ngOnInit(): void {

  }

  login():void
  {
    this.IsLogin = false;
    this.doLogin().subscribe();
  }

  doLogin()
  {
    this.spinnerService.show();
    return this.loginService.apiOutsourceLogin(this.UserCode).pipe(
      tap(res =>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.IsLogin = true;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }


  submit()
  {
    var data1:ReportWorkOrderMetaReq =
    {
      Account:this.UserCode,
      data:this.GridData
    };
    this.doSubmit(data1).subscribe();
  }

  doSubmit(data:ReportWorkOrderMetaReq)
  {
    this.spinnerService.show();
    return this.rest.apiReportWorkOrderMeta(data).pipe(
      tap(res=>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          this.WorkOrder = '';
          throw (res.ErrorMsg)
        }
        this.rest.alertWithMessage("執行成功");
        this.GridData = [];
      }),
      catchError((res)=>{
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }

  checkBarcode()
  {
    // if (this.WorkOrder == '' || this.WorkOrder == undefined){
    //   this.rest.alertWithMessage('請刷入製令條碼!');
    //   return;
    // }
    this.WorkOrder =  this.WorkOrder.replace("https://mail.yjfcasting.com:8013/report_working?","");
    var workOrderArr = this.WorkOrder.split('&');
    var workOrderHead = workOrderArr[0].split('=')[1];
    var workOrder = workOrderArr[1].split('=')[1];
    this.WorkOrder = workOrderHead + '-' + workOrder;
    this.singleWorkOrder = {
      WorkOrder: this.WorkOrder,
      InStationDate: this.yyyymmdd() ,
      Submittor: this.UserCode,
      ReveiceFlag: ''
    };
    this.loadData(this.singleWorkOrder);

  }

  loadData(data:WorkOrderMeta)
  {
    if (this.WorkOrder == '' || this.WorkOrder == undefined)
    {
      return;
    }
    this.spinnerService.show();
    this.exist = false;
    return this.rest.apiLoadWorkOrderMeta(data).pipe(
      tap(res =>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          if (res.ErrorMsg.indexOf('製令不存在') != -1)
          {
            this.exist = false;
          }
          this.WorkOrder = '';
          throw (res.ErrorMsg)
        }
        this.exist = true;
        if (res.result != null && res.result != undefined)
        {
          this.singleWorkOrder = res.result;
        }
        if(this.exist)
        {
          // 過濾重複刷入的工單
          const duplicateList = this.GridData.filter((i, idx: number) => i.WorkOrder == this.singleWorkOrder.WorkOrder);
          if (duplicateList.length == 0)
            this.GridData.push(this.singleWorkOrder);

          this.WorkOrder = '';
          this.renderer.selectRootElement('#myInput').focus();
        }
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }


  public yyyymmdd() {
    var y = new Date().getFullYear().toString();
    var m = (new Date().getMonth() + 1).toString();
    var d = new Date().getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y + m + d;
    return yyyymmdd;
  }
}
