import { UtilityService } from 'src/app/Service/utility.service';
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { OrderStatusInfo } from 'src/app/Model/production';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ExportSftRecordDataRequest } from 'src/bin/exportSftRecordDataRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { SftLineListResponseLineCodeName } from 'src/bin/SftLineListResponseLineCodeName';
import { of } from 'rxjs';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-sftrecord',
  templateUrl: './sftrecord.component.html',
  styleUrls: ['./sftrecord.component.css'],
})
export class SFTRecordComponent implements OnInit {
  @ViewChild('myTable') table: any;
  currentDate: Date = new Date();
  totalWeight: number = 0;
  totalWeightPostProc: number = 0;
  constructor(
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private utilityService:UtilityService
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  public MakeOrderList: Array<OrderStatusInfo>;
  noDataMessages = {
    emptyMessage: `
    <div>
      查無資料
    </div>
  `
  };
  Searchtxt: string = "";
  ScheduleStartday = "";
  ScheduleEndday = "";
  BillingStartday = "";
  BillingEndday = "";
  woSchStatus = "3";

  rowHeight = 50;        // 每行高度，例如 50px
  maxVisibleRows = 10;   // 當資料超過這個行數，啟用滾動

  OrderStatus = "N";
  ShutStatus = "運作中";
  StatusList: Array<any> = [
    { value: "all", text: "全選", selected: true },
    { value: "1", text: "未生產", selected: true },
    { value: "3", text: "生產中", selected: true },
    { value: "Y", text: "已完工", selected: true },
    { value: "y", text: "指定完工", selected: true },
  ]
  // 前段
  GridData: Array<OrderStatusInfo> = new Array<OrderStatusInfo>();
  GridDataMap:Map<string, Array<OrderStatusInfo>> = new Map<string, Array<OrderStatusInfo>>();
  GridDataMapKeys:Array<string> = [];
  // 後處理磨毛邊後製程
  GridDataPostProc: Array<OrderStatusInfo> = new Array<OrderStatusInfo>();
  GridDataMapPostProc:Map<string, Array<OrderStatusInfo>> = new Map<string, Array<OrderStatusInfo>>();
  GridDataMapKeysPostProc:Array<string> = [];
  ProductionLine = "全部";
  StatusArr = "";
  ProductionList: Array<SftLineListResponseLineCodeName> = [];
  expanded: any = {};
  timeout: any;
  SOLight:string;
  soLights:Array<{
    text:string;
    value:boolean
  }> = [
    {
      text:'red',
      value:true,
    },
    {
      text:'orange',
      value:true,
    },
    {
      text:'green',
      value:true,
    },
    {
      text:'lightpurple',
      value:true,
    },
    {
      text:'blue',
      value:true,
    },
    {
      text:'gray',
      value:true,
    },
  ];
  woLights:Array<{
    text:string;
    value:boolean;
  }> = [
    {
      text:'red',
      value:true,
    },
    {
      text:'orange',
      value:true,
    },
    {
      text:'green',
      value:true,
    },
    {
      text:'gray',
      value:true,
    },
  ];
  mailList:string[] = [];
  ShutDownStatusList: Array<{
    value: string;
    text: string;
    selected: boolean;
  }> = [
      { value: "運作中", text: "運作中", selected: true },
      { value: '已暫停', text: '已暫停', selected: false },
      { value: '外包中', text: '外包中', selected: false }
    ];
  form: FormGroup = new FormGroup({
    searchTxt: new FormControl(''),
    productionLine: new FormControl('全部'),
    scheduleStartday: new FormControl(''),
    scheduleEndday: new FormControl(''),
    billingStartday: new FormControl(''),
    billingEndday: new FormControl(''),
    statusList: this.fb.array([]),
    orderStatus: new FormControl('ALL'),
    shutDownStatus: this.fb.array([]),
    woSchStatus: new FormControl('3'),
    soLightArray:this.fb.array([]),
    woLightArray:this.fb.array([]),
  });
  exportSftRecordDataRequest: ExportSftRecordDataRequest = {
    Account: this.UserAccount,
    Searchtxt: this.Searchtxt,
    StatusSelectedList: this.StatusArr,
    OrderStatus: this.OrderStatus,
    ScheduleStartday: this.ScheduleStartday.replace(/-/g, ''),
    ScheduleEndday: this.ScheduleEndday.replace(/-/g, ''),
    BillingStartday: this.BillingStartday.replace(/-/g, ''),
    BillingEndday: this.BillingEndday.replace(/-/g, ''),
    ProductionLine: this.ProductionLine,
    OrdererrStatus: this.ShutStatus,
    woSchStatus: this.woSchStatus,
    soLights:this.soLights,
    woLights:this.woLights,
  }
  noChange = { emitEvent: false, onlySelf: true };

  ngOnInit(): void {
    this.setInitDate();

    this.StatusList.forEach((i, idx) => {
      var control = this.fb.control(true);
      if (idx == 1 || idx  == 2)
        control = this.fb.control(true);
      else
        control = this.fb.control(false);
      (this.form.get('statusList') as FormArray).push(control);
    });
    this.ShutDownStatusList.forEach((i, idx) => {
      let control = this.fb.control(true);
      if (idx == 1 || idx  == 2)
        control = this.fb.control(false);
      if (control)
      (this.form.get('shutDownStatus') as FormArray).push(control)
    });
    this.soLights.forEach((i, idx) => {
      // let control = this.fb.control(false);
      // if (idx == 0)
      let  control = this.fb.control(true);
      if (control)
      (this.form.get('soLightArray') as FormArray).push(control);
    });
    this.woLights.forEach((i, idx) => {
      let control = this.fb.control(true);
      if (control)
      (this.form.get('woLightArray') as FormArray).push(control);
    });
    this.setRequest(true);
    const statusListControl = this.form.get('statusList');
    (statusListControl as FormArray).at(0).valueChanges.pipe(
      tap(res => {
        if (res) {
          const allItem = this.StatusList.map(() => true);
          statusListControl.setValue(allItem, this.noChange)
        }
      })
    ).subscribe();
    statusListControl.valueChanges.pipe(
      tap((res) => {
        const restItem = res.filter((i, idx) => idx != 0);
        res[0] = restItem.every((i) => i = true);
        statusListControl.setValue(res, this.noChange)
      })
    ).subscribe();
    this.GetData().pipe(
      switchMap(() => {
        return this.getLineList();
      })
    ).subscribe();
  }

  getTableHeight(data: any[]): number {
    const dataLength = data.length;

    // 如果資料超過 maxVisibleRows，限制高度，否則根據資料筆數動態設置高度
    return dataLength > this.maxVisibleRows
      ? this.rowHeight * this.maxVisibleRows * 4
      : this.rowHeight * dataLength * 4;
  }

  getScrollbarV(data: any[]): boolean {
    // 如果資料超過 maxVisibleRows，啟用垂直滾動
    return data.length > this.maxVisibleRows;
  }

  get statusListArray() {
    return (this.form.get('statusList') as FormArray).controls
  }

  get shutDownStatusArray() {
    return (this.form.get('shutDownStatus') as FormArray).controls
  }

  get soLightArrays(){
    return (this.form.get('soLightArray') as FormArray).controls
  }

  get woLightArrays(){
    return (this.form.get('woLightArray') as FormArray).controls
  }

  /**
   *取得生產狀態燈號
   *紅色 delay
   *綠色 交期正常
   *橘色 暫停
   * @param {OrderStatusInfo} ob
   * @return {*}  {string}
   * @memberof SFTRecordComponent
   */
  getLights(ob: OrderStatusInfo): string {
    let result = 'green';
    if (ob.OrderStatus.toUpperCase() == 'Y'){
      result = '';
    }
    if (ob.OrdererrStatus == '已暫停') {
      result = 'gray';
    }
    else {
      if (ob.WorkOrderStatus == false) {
        result = 'red';
        if (ob.LateStart)
        {
          result = 'orange';
        }
      }
      if (ob.WorkOrderStatus == null) {
        result = 'done'
      }
    }
    return result
  }
  addWorkOrderInMailList(mailAdded:boolean, workOrder:string){
    if (!mailAdded)
      this.mailList.push(workOrder);
    else
    {
      this.mailList = this.mailList.filter(x => x != workOrder);
    }
    console.log(this.mailList);
  }
  /**
   * 寄送核取方塊的email

   *
   * @memberof SFTRecordComponent
   */
  sendmail()
  {
    this.spinnerService.show();
    this.rest.apiSendChangeEDTList(this.mailList).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.rest.successMessage("執行成功");
        // res.lineCodeNames.forEach((i) => this.ProductionList.push(i));
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  /**
   *取得訂單狀態燈號
   *紅色 delay
   *綠色 交期正常
   *橘色 暫停
   * @param {OrderStatusInfo} ob
   * @return {*}  {string}
   * @memberof SFTRecordComponent
   */
   getSOLights(ob: OrderStatusInfo): string {
    let result = 'gray';
    if (ob.OrdererrStatus == '已暫停') {
      result = 'lightpurple';
    }
    else {
      if (ob.SalesOrderStatus == "S"){
        result = 'blue';
      }
      if (ob.SalesOrderStatus == "P"){
        result = 'green';
      }
      if (ob.SalesOrderStatus == "N"){
        result = 'orange';
      }
      if (ob.SalesOrderStatus == "L"){
        result = 'red';
      }
      if (ob.SalesOrderStatus == "O"){
        result = 'gray';
      }
      // if (ob.WorkOrderStatus == false) {
      //   result = 'red';
      //   if (ob.LateStart)
      //   {
      //     result = 'orange';
      //   }
      // }
      // if (ob.WorkOrderStatus == null) {
      //   result = 'done'
      // }
    }
    return result
  }
  /**
   *取得所有產線
   *
   * @memberof SFTRecordComponent
   */
  getLineList() {
    this.spinnerService.show();
    return this.rest.apiSftLineList().pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        res.lineCodeNames.forEach((i) => this.ProductionList.push(i));
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }
  /**
   *取得資料
   *
   * @memberof SFTRecordComponent
   */
  GetData() {
    this.spinnerService.show();
    this.totalWeight = 0;
    this.totalWeightPostProc = 0;
    this.GridDataMap = new Map<string, Array<OrderStatusInfo>>();
    this.GridDataMapPostProc = new Map<string, Array<OrderStatusInfo>>();
    return this.rest.apiSftRecordData(this.exportSftRecordDataRequest).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        console.log('makeOrderlist', res.makeOrderlist);
        console.log('makeOrderlistPostProc', res.makeOrderlistPostProc);
        // 前段製程
        let tmpHasETD = res.makeOrderlist.filter(x => x.ETD != '').sort((a, b) => {
            if (a.ETD > b.ETD)
              return 1;
            else
              return -1;
        });// 有預交日
        let tmpHasNotETD = res.makeOrderlist.filter(x => x.ETD === '');// 沒有預交日
        this.GridData = [...tmpHasETD, ...tmpHasNotETD];
        this.GridData.forEach((i) => {
          this.totalWeight = this.totalWeight + Math.floor(i.Weight);
          let listMap = new Array<OrderStatusInfo>();
          if (this.GridDataMap.has(i.CustomerName))
          {
            listMap = this.GridDataMap.get(i.CustomerName);
          }
          listMap.push(i);
          this.GridDataMap.set(i.CustomerName, listMap);
        });
        this.GridDataMapKeys = Array.from<string>(this.GridDataMap.keys());


        // 後段製程
        tmpHasETD = res.makeOrderlistPostProc.filter(x => x.ETD != '').sort((a, b) => {
          if (a.ETD > b.ETD)
            return 1;
          else
            return -1;
        });// 有預交日
        tmpHasNotETD = res.makeOrderlistPostProc.filter(x => x.ETD === '');// 沒有預交日
        this.GridDataPostProc = [...tmpHasETD, ...tmpHasNotETD];
        this.GridDataPostProc.forEach((i) => {
          this.totalWeightPostProc = this.totalWeightPostProc + Math.floor(i.Weight);
          let listMap = new Array<OrderStatusInfo>();
          if (this.GridDataMapPostProc.has(i.CustomerName))
          {
            listMap = this.GridDataMapPostProc.get(i.CustomerName);
          }
          listMap.push(i);
          this.GridDataMapPostProc.set(i.CustomerName, listMap);
        });
        this.GridDataMapKeysPostProc = Array.from<string>(this.GridDataMapPostProc.keys());

        // console.log('GridDataMap', this.GridDataMap);
        // console.log('GridDataMapKeys', this.GridDataMapKeys);
        // 後段製程

        // updateTableHeight()
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    );
  }
  StatusSelectChange(event, item) {
    if (item.value == 'all') {
      this.StatusList.forEach(element => {
        element.selected = event;
      });
    } else {
      item.selected = event;
      if (event == true) {
        this.ShutStatus = "運作中";
        let IsAllCheck = true;
        for (let index = 1; index < this.StatusList.length; index++) {
          if (this.StatusList[index].selected == false && this.StatusList[index].value != item.value) {
            IsAllCheck = false;
          }
        }
        this.StatusList[0].selected = IsAllCheck;
      } else {
        this.StatusList[0].selected = false;
        this.ShutStatus = "已暫停";
      }
    }
  }

  ShutSelectChange(event, item) {
    if (item.value == 'all') {
      this.StatusList.forEach(element => {
        element.selected = event;
      });
    } else {
      item.selected = event;
      if (event == true) {
        let IsAllCheck = true;
        for (let index = 1; index < this.StatusList.length; index++) {
          if (this.StatusList[index].selected == false && this.StatusList[index].value != item.value) {
            IsAllCheck = false;
          }
        }
        this.StatusList[0].selected = IsAllCheck;
      } else {
        this.StatusList[0].selected = false;
      }
    }
  }

  /**
   *下載Excel檔案
   *
   * @memberof SFTRecordComponent
   */
  ExportData(customer:string) {
    this.spinnerService.show();
    if (customer && customer != ''){
      this.exportSftRecordDataRequest.Searchtxt = customer;
    }
    this.rest.apiExportSftRecordData(this.exportSftRecordDataRequest).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        const filePath = `${this.rest.APserver}${res.ExcelFilePath}`;
        window.open(filePath);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }


  toggleExpandRow(row, table) {
    console.log('Toggled Expand Row!', row);
    table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }
  //yyyymmdd=>yyyy-mm-dd
  // DateStringFormat(date: string) {
  //   if (!date) return date
  //   if (date.length < 8) return date

  //   return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  // }


  /**
   *開啟modal
   *
   * @param {*} model
   * @memberof SFTRecordComponent
   */
  openmodal(model: any): void {
    this.requestToForm();
    this.modalService.open(model, { size: 'lg' })
  }
  /**
   *開始搜尋
   *
   * @memberof SFTRecordComponent
   */
  onSearch(): void {
    this.setRequest();
    this.modalService.dismissAll();
    this.GetData().subscribe();
  }
  /**
   *清除搜尋資料
   *
   * @memberof SFTRecordComponent
   */
  onClear() {
    this.form.reset();
    this.form.get('productionLine').setValue('全部');
    const statusArray = this.StatusList.map(() => true);
    this.form.get('statusList').setValue(statusArray);
    this.form.get('orderStatus').setValue('ALL');
    const errStatusArray = this.shutDownStatusArray.map(() => true);
    this.form.get('shutDownStatus').setValue(errStatusArray, this.noChange);
  }
  /**
   *設定API的request
   *
   * @memberof SFTRecordComponent
   */
  setRequest(init: boolean = false) {
    this.Searchtxt = this.form.get('searchTxt').value;
    if (!init) {
      this.ScheduleStartday = this.form.get('scheduleStartday').value;
      this.ScheduleEndday = this.form.get('scheduleEndday').value;
      this.BillingStartday = this.form.get('billingStartday').value;
      this.BillingEndday = this.form.get('billingEndday').value;
      this.woSchStatus = this.form.get('woSchStatus').value;
    }

    const status: Array<boolean> = this.form.get('statusList').value;
    this.StatusList.forEach((i, idx) => {
      i.selected = status[idx];
    });
    // console.log('orderStatus',this.form.get('orderStatus').value);
    this.form.get('orderStatus').setValue('N');

    this.OrderStatus = this.form.get('orderStatus').value;
    const shutDownStatus: Array<boolean> = this.form.get('shutDownStatus').value;
    this.ShutDownStatusList.forEach((i, idx) => {
      i.selected = shutDownStatus[idx];
    });

    const soLightsArray:Array<boolean> = this.form.get('soLightArray').value;
    console.log(soLightsArray);
    this.soLights.forEach((i, idx) => {
      i.value = soLightsArray[idx];
    });
    const soVal = this.soLights.map(x=>x.value);
    this.form.get('soLightArray').setValue(soVal);

    const woLightsArray:Array<boolean> = this.form.get('woLightArray').value;
    console.log(woLightsArray);
    this.woLights.forEach((i, idx) => {
      i.value = woLightsArray[idx];
    });
    const woVal = this.woLights.map(x=>x.value);
    this.form.get('woLightArray').setValue(woVal);

    this.ProductionLine = this.form.get('productionLine').value;
    this.StatusArr = this.StatusList.filter(x => x.selected == true && x.value != 'all').map(m => m.value).join(',');
    if (this.ShutDownStatusList.every((i) => i.selected == true)) {
      this.ShutStatus = '全部';
    } else {
      this.ShutStatus = this.ShutDownStatusList.filter(i => i.selected == true).map(i => i.value).join(',');
    }

    this.exportSftRecordDataRequest = {
      Account: this.UserAccount,
      Searchtxt: this.Searchtxt,
      StatusSelectedList: this.StatusArr,
      ScheduleStartday: this.ScheduleStartday ? this.ScheduleStartday.replace(/-/g, '') : '',
      ScheduleEndday: this.ScheduleEndday ? this.ScheduleEndday.replace(/-/g, '') : '',
      BillingStartday: this.BillingStartday ? this.BillingStartday.replace(/-/g, '') : '',
      BillingEndday: this.BillingEndday ? this.BillingEndday.replace(/-/g, '') : '',
      ProductionLine: this.ProductionLine,
      OrderStatus: this.OrderStatus,
      OrdererrStatus: this.ShutStatus,
      woSchStatus: this.woSchStatus,
      woLights:this.woLights,
      soLights:this.soLights
    }
  }

  requestToForm(): void {
    this.form.get('searchTxt').setValue(this.Searchtxt, this.noChange);
    this.form.get('productionLine').setValue(this.ProductionLine, this.noChange);
    this.form.get('scheduleStartday').setValue(this.ScheduleStartday, this.noChange);
    this.form.get('scheduleEndday').setValue(this.ScheduleEndday, this.noChange);
    this.form.get('billingStartday').setValue(this.BillingStartday, this.noChange);
    this.form.get('billingEndday').setValue(this.BillingEndday, this.noChange);
    this.form.get('orderStatus').setValue(this.OrderStatus, this.noChange);
    const status = this.StatusList.map(i => i.selected);
    this.form.get('statusList').setValue(status, this.noChange);
    const shutDownStatus = this.ShutDownStatusList.map(i => i.selected);
    this.form.get('shutDownStatus').setValue(shutDownStatus, this.noChange);
    this.form.get('woSchStatus').setValue(this.woSchStatus, this.noChange);
    const soLightArr = this.soLights.map(i =>i.value);
    this.form.get('soLightArray').setValue(soLightArr, this.noChange);
    const woLightArr = this.woLights.map(i =>i.value);
    this.form.get('woLightArray').setValue(woLightArr, this.noChange);
  }

  /**
   *設定初始時間區間
   *
   * @memberof SFTRecordComponent
   */
  setInitDate() {
    const today = new Date();
    const dueDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
    function toDoubleDigit(input: number): string {
      let result = input.toString();
      if (input < 10) result = `0${input}`;
      return result
    }
    function dateToString(input: Date): string {
      return [input.getFullYear(), toDoubleDigit(input.getMonth() + 1), toDoubleDigit(input.getDate())].join('-')
    }
    const todayString = dateToString(today);
    const dueDateString = dateToString(dueDate);
    // this.ScheduleStartday = dueDateString;
    this.BillingStartday = dueDateString;
    // this.ScheduleEndday = todayString;
    this.BillingEndday = todayString;

  }
}
