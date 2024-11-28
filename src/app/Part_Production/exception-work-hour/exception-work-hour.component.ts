import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProdutionService } from 'src/app/Service/ProdutionService';

@Component({
  selector: 'app-exception-work-hour',
  templateUrl: './exception-work-hour.component.html',
  styleUrls: ['./exception-work-hour.component.css']
})
export class ExceptionWorkHourComponent implements OnInit {
  workOrder:string = '';
  id?:number = null;
  workOrderAdd:string= '';
  partNo:string = '';
  partNoAdd:string = '';
  partDesc:string = '';
  partDescAdd:string = '';
  excpTime:string = '';
  excpTimeAdd:string = '';
  excpType:string = '';
  excpTypeAdd:string = '';
  excpReason:string = '';
  excpReasonAdd:string = '';
  quantity?:number = null;
  quantityAdd?:number = null;
  GridData:any[];
  UserAccount:string = '';
  comment:string = '';
  constructor(
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private session: SessionStorageService,) { }

  ngOnInit(): void {
    this.UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  }

  query(){
    if (this.workOrder.trim() == '' &&
      this.partDesc == '' &&
      this.partNo == '' &&
      this.excpTime == '' &&
      this.excpType == ''){
        this.rest.errorWithErrorMsg('請輸入查詢條件!');
        return;
      }
    let queryParameter = {
      workOrder: this.workOrder,
      partNo: this.partNo,
      partDesc: this.partDesc,
      excpTime: this.excpTime,
      excpType: this.excpType,
    };
    this.spinnerService.show();
    this.rest.apiQueryExceptionWorkHour(queryParameter).pipe(
      tap(res =>{
        this.GridData = res.result;
        if (this.GridData.length == 0)
        {
          this.rest.errorWithErrorMsg('無資料!');
        }
        this.spinnerService.hide();
      }),
      catchError((rep) => {
        this.rest.errorWithErrorMsg(rep);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  filter(category:string){
    if (category == '')
      return this.GridData;
    if (category == 'WorkOrder')
    {
      let tmpData = this.GridData.filter(x => x.WorkOrder.indexOf(this.workOrder) != -1);
      return tmpData;
    }
    if (category == 'PartNo')
    {
      let tmpData = this.GridData.filter(x => x.PartNo.indexOf(this.partNo) != -1);
      return tmpData;
    }
    if (category == 'PartDesc')
    {
      let tmpData = this.GridData.filter(x => x.PartDesc.indexOf(this.partDesc) != -1);
      return tmpData;
    }
    if (category == 'ExcpTime')
    {
      let tmpData = this.GridData.filter(x => x.ExcpTime.indexOf(this.excpTime) != -1);
      return tmpData;
    }
    if (category == 'ExcpType')
    {
      let tmpData = this.GridData.filter(x => x.ExcpType.indexOf(this.excpType) != -1);
      return tmpData;
    }
  }
  add(id?:number)
  {
    if(!this.quantityAdd || this.quantityAdd === 0)
    {
      this.rest.errorWithErrorMsg('請輸入數量!');
      return;
    }
    let now = new Date();
    let nowStr = formatDate(now, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    let addObj =  {
      Account:this.UserAccount,
      id:id,
      workOrder: this.workOrderAdd,
      partNo: this.partNoAdd,
      partDesc: this.partDescAdd,
      quantity:this.quantityAdd,
      excpTime: nowStr,
      excpType: this.excpTypeAdd,
      excpReason: this.excpReasonAdd
    };
    // if (!id)
    // {
      this.spinnerService.show();
      this.rest.apiAddExceptionWorkHour(addObj).pipe(
        tap(res =>{
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          this.rest.successMessage('執行成功');
          this.spinnerService.hide();
        }),
        catchError((rep) => {
          this.rest.errorWithErrorMsg(rep);
          this.spinnerService.hide();
          return of()
        })
      ).subscribe();
      this.modalService.dismissAll();
    // }
  }
  addPopup(model:any, id?:number): void {
    this.requestToForm(id);
    this.modalService.open(model, { size: 'lg' });
  }
  requestToForm(id?:number)
  {
    if (id){
      let queryItem = this.rest.apiQueryExceptionWorkHour({id:id}).pipe(
        tap((res) =>{
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
          let data = res.result[0];
          console.log(data);
          if(data){
            this.id = data.ID;
            console.log('id',this.id);
            this.workOrderAdd = data.WorkOrder;
            this.partNoAdd = data.PartNo;
            this.partDescAdd = data.PartDesc;
            this.quantityAdd = data.Quantity;
            this.excpTypeAdd = data.ExcpType;
            console.log('excpTypeAdd:'+this.excpTypeAdd);
            this.excpTimeAdd = data.ExcpTime;
            this.excpReasonAdd = data.ExcpColumn;
          } else {
            throw ('找不到資料');
          }
        }),
        catchError(res =>{
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        })
      ).subscribe();
    }
    else
    {
      this.id = null;
      this.workOrderAdd = '';
      this.partNoAdd = '';
      this.partDescAdd = '';
      this.quantity = 0;
      this.excpTypeAdd = '';
      this.excpTimeAdd = '';
      this.excpReasonAdd = '';
    }
  }
  queryPartInfo(WorkOrder:string)
  {
    if (WorkOrder.trim() == '')
      return;
    this.spinnerService.show();
    this.rest.apiQueryPartInfoByWO({WorkOrder: WorkOrder}).pipe(
      tap(res =>{
        if (res.result)
        {
          let data = res.result;
          this.partNoAdd = data.PartNo;
          this.partDescAdd = data.PartDesc;
        }
        else
        {
          this.workOrderAdd = '';
          this.rest.errorWithErrorMsg('找不到品號資訊');
        }
        this.spinnerService.hide();
      }),
      catchError((rep) =>{
        this.rest.errorWithErrorMsg(rep);
          this.spinnerService.hide();
          return of()
      })
    ).subscribe();
  }
}
