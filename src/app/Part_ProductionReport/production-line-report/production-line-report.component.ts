import { StatuList } from './../../Part_RFQ_Result/rfq-supplier-status/rfq-supplier-status.component';
import { Component, OnInit } from '@angular/core';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpectUnboxingDataRequest } from 'src/bin/expectUnboxingDataRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-production-line-report',
  templateUrl: './production-line-report.component.html',
  styleUrls: ['./production-line-report.component.css']
})
export class ProductionLineReportComponent implements OnInit {
  constructor(
    public rest: ProdutionReportService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  UnboxingData: Array<any> = new Array<any>();

  OrderList: Array<any> = [{
    name: '全部',
    value: '',
    selected: true
  }];
  form: FormGroup = new FormGroup({});
  form1: FormGroup = new FormGroup({});
  noDataMessages = {
    emptyMessage: `
    <div>
      查無資料
    </div>
  `
  };

  //搜尋參數
  PouringFilterStartDate: string = "";
  PouringFilterEndDate: string = "";
  UnboxingFilterStartDate: string = "";
  UnboxingFilterEndDate: string = "";
  ETDFilterStartDate: string = "";
  ETDFilterEndDate: string = "";
  ProductionOrderText: string = "";
  ItemCodeText: string = "";
  FlaskText: string = "";
  itemCount:number = 0;// 件數
  totalWeight:number = 0;// 總重
  //搜尋POPUP
  PouringFilterStartDateSearchTerm: string = "";
  PouringFilterEndDateSearchTerm: string = "";
  UnboxingFilterStartDateSearchTerm: string = "";
  UnboxingFilterEndDateSearchTerm: string = "";
  ETDFilterStartDateSearchTerm: string = "";
  ETDFilterEndDateSearchTerm: string = "";
  ProductionOrderTextSearchTerm: string = "";
  ItemCodeTextSearchTerm: string = "";
  FlaskTextSearchTerm: string = "";
  productionStatusOptions:Array<any> = [
    // {
    //   itemName:"未生產",
    //   value:"1",
    //   selected:true
    // },
    {
      itemName:"已生產",
      value:"3",
      selected:true
    },
    // {
    //   itemName:"已完工",
    //   value:"Y",
    //   selected:false
    // },
    // {
    //   itemName:"指定完工",
    //   value:"y",
    //   selected:false
    // }
  ];
  ngOnInit(): void {
    this.GetData();
  }
  onCheckboxChange(event: any, row: any) {
    // 根據 checkbox 的選擇狀態來改變 row 資料
    row.checked = event.target.checked;
    // alert(row.checked);
    // 如果 checkbox 被勾選，將狀態改為 '已選擇'，否則改為 '未選擇'
    if(row.checked)
    {
      row.week = this.getWeek();
    }
    else
    {
      row.week = '';
    }
    this.update(row);
  }

  update(row){
    // 控制輸入的週別
    if (row.week > 52)
      row.week = 52;
    if (row.week < 0)
      row.week = 1;
    this.spinnerService.show();
    this.rest.apiPostProcWeek(row.week, row.ProductionOrderCode).pipe(
      tap(res=>{
        if(row.week != '')
        {
          row.checked = true;
        }
        else
        {
          row.checked = false;
        }
        this.spinnerService.hide();
      }),
      catchError((res)=>{
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
    // 如果需要，通知表格進行重繪（通常是可自動更新的）
    this.UnboxingData = [...this.UnboxingData]; // 這是為了觸發表格的變更檢測
  }

  getISOWeekNumber(date: Date): number {
    // 設置日期為該星期的星期一
    const tempDate = new Date(date.getTime());
    const dayOfWeek = (tempDate.getDay() + 6) % 7; // 使得星期天變為6，星期一變為0
    tempDate.setDate(tempDate.getDate() - dayOfWeek + 3); // 設定日期為星期四

    // 計算該日期是那一年的第幾天
    const firstThursday = new Date(tempDate.getFullYear(), 0, 4); // 當年1月4日
    const dayDiff = (tempDate.getTime() - firstThursday.getTime()) / (24 * 60 * 60 * 1000); // 天數差
    const firstThursdayDayOfWeek = (firstThursday.getDay() + 6) % 7; // 當年1月4日的星期

    // 計算ISO週數
    return 1 + Math.floor((dayDiff - (3 - firstThursdayDayOfWeek)) / 7);
  }


  getWeek() {
    var nextWeekDate = new Date();
    nextWeekDate.setDate(new Date().getDate()+7);
    return this.getISOWeekNumber(nextWeekDate);
  }
  GetData() {
    this.spinnerService.show();
    const request: ExpectUnboxingDataRequest = {
      Account: this.UserAccount,
      MoldingStartDate: this.PouringFilterStartDate,
      MoldingEndDate: this.PouringFilterEndDate,
      ETDFilterStartDate: this.ETDFilterStartDate,
      ETDFilterEndDate: this.ETDFilterEndDate,
      UnboxingStartDate: this.UnboxingFilterStartDate,
      UnboxingEndDate: this.UnboxingFilterEndDate,
      ProductionOrderText: this.ProductionOrderText,
      ItemCodeText: this.ItemCodeText,
      FlaskText: this.FlaskText,
      orderType: '',
      productionStatus:'3'
    }
    this.itemCount = 0;
    this.totalWeight = 0;
    this.rest.API_requestExpectUnboxingData(request).pipe(
      tap(res => {
        this.UnboxingData = res.processInfos1;
        this.UnboxingData.forEach(res=>{
          // console.log(res);
          this.itemCount += res.Qty;
          this.totalWeight += res.Qty * res.UnitWeight;
        });
        this.totalWeight = Math.round( parseFloat(this.totalWeight.toString()));
        let OrderTypeList = Array.from(new Set(this.UnboxingData.map(item => item.TA026)));
        for (let index = 0; index < OrderTypeList.length; index++) {
          if (OrderTypeList[index] != "****" && OrderTypeList[index] != "") {
            this.OrderList.push({
              name: OrderTypeList[index],
              value: OrderTypeList[index],
              selected: true
            });
          }
        }
        this.spinnerService.hide();
      }),
      tap(() => {
        this.OrderList.forEach((i, index) => {
          this.form.addControl(`type${index}`, this.fb.control(true));
        });
        this.productionStatusOptions.forEach((i, index) =>{
          this.form1.addControl(`Statustype${index}`, this.fb.control(i.selected));
        });
      }),
      switchMap(() => {
        return this.form.get('type0').valueChanges
      }),
      tap((res) => {
        let controls = Object.keys(this.form.controls);
        controls.forEach((i) => {
          if (i != 'type0') this.form.get(i).setValue(res, { emitEvent: false, onlySelf: true });
        });
        controls = Object.keys(this.form1.controls);
        controls.forEach((i) => {
          this.form1.get(i).setValue(res, { emitEvent: false, onlySelf: true });
        });
      }),
    ).subscribe();

    this.form.valueChanges.pipe(
      tap((res) => {
        let result = true;
        let controls = Object.keys(this.form.controls);
        for (let i = 0; i < controls.length; i++) {
          if (controls[i] == 'type0') {
            continue
          } else {
            if (this.form.get(controls[i]).value == false) {
              result = false;
              break
            }
          }
        }
        this.form.get('type0').setValue(result, { emitEvent: false, onlySelf: true });
      })
    ).subscribe();

    this.form1.valueChanges.pipe(
      tap((res) => {
        let result = true;
        let controls = Object.keys(this.form1.controls);
        for (let i = 0; i < controls.length; i++) {
          // console.log(controls[i]);
          // console.log(this.form1.get(controls[i]).value);
          // if (controls[i] == 'type0') {
          //   continue
          // } else {
            if (this.form1.get(controls[i]).value == false) {
              result = false;
              // break
            }
          // }
        }
        // this.form1.get('Statustype0').setValue(result, { emitEvent: false, onlySelf: true });
      })
    ).subscribe();
  }

  ExportData() {
    this.spinnerService.show();
    let orders = '';
    if (!this.OrderList[0].selected) {
      orders = this.OrderList.filter((i) => {
        return i.value != '' && i.selected == true
      }).map((i) => {
        return i.value
      }).join();
    }
    this.rest.API_ExportExpectUnboxing(this.UserAccount,
      this.PouringFilterStartDate.replace(/-/g, ''),
      this.PouringFilterEndDate.replace(/-/g, ''),
      this.ETDFilterStartDate.replace(/-/g, ''),
      this.ETDFilterEndDate.replace(/-/g, ''),
      this.UnboxingFilterStartDate.replace(/-/g, ''),
      this.UnboxingFilterEndDate.replace(/-/g, ''),
      this.ProductionOrderText,
      this.ItemCodeText,
      this.FlaskText,
      orders).then(
        (data) => {
          let filepath: string = data['ExcelFilePath'];

          window.open(filepath);
        }
      ).finally(() => {
        this.spinnerService.hide();
      });
  }
  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (!date)
      return date
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }

  OrderListSelectChange(event, item) {
    if (!item.value) {
      this.OrderList.forEach(element => {
        element.selected = event;
      });
    } else {
      item.selected = event;
      if (event == true) {
        let IsAllCheck = true;
        for (let index = 1; index < this.OrderList.length; index++) {
          if (this.OrderList[index].selected == false && this.OrderList[index].value != item.value) {
            IsAllCheck = false;
          }
        }
        this.OrderList[0].selected = IsAllCheck;
      } else {
        this.OrderList[0].selected = false;
      }
    }

  }

  //Data轉'yyyy-mm-dd'
  DateFormat(date) {
    date = new Date(date);
    var day = ('0' + date.getDate()).slice(-2);
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }
  //星期日跳過
  AddDate(date, addDay: number) {
    var add = 0;
    if (date == "") {
      return date
    }
    var newdate = new Date(date);
    if (addDay > 0) {
      while (add < addDay) {
        newdate.setDate(newdate.getDate() + 1);
        if (newdate.getDay() != 0) {
          add++;
        }
      }
      return this.DateFormat(newdate);
    } else if (addDay < 0) {
      while (add > addDay) {
        newdate.setDate(newdate.getDate() - 1);
        if (newdate.getDay() != 0) {
          add--;
        }
      }
      return this.DateFormat(newdate);
    } else {
      return this.DateFormat(date);
    }

  }
  /**
   *打開搜尋popup
   *
   * @param {*} modal
   * @memberof ProductionLineReportComponent
   */
  openmodal(modal: any) {
    this.PouringFilterStartDateSearchTerm = this.PouringFilterStartDate;
    this.PouringFilterEndDateSearchTerm = this.PouringFilterEndDate;
    this.UnboxingFilterStartDateSearchTerm = this.UnboxingFilterStartDate;
    this.UnboxingFilterEndDateSearchTerm = this.UnboxingFilterEndDate;
    this.ETDFilterStartDateSearchTerm = this.ETDFilterStartDate;
    this.ETDFilterEndDateSearchTerm = this.ETDFilterEndDate;
    this.ProductionOrderTextSearchTerm = this.ProductionOrderText;
    this.ItemCodeTextSearchTerm = this.ItemCodeText;
    this.FlaskTextSearchTerm = this.FlaskText;
    this.orderStringToSearchTerm();
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }
  /**
   *執行搜尋
   *
   * @memberof ProductionLineReportComponent
   */
  onSearch() {
    this.setRequest();
    this.modalService.dismissAll();
    let orders = '';
    let statuses = '';
    if (!this.OrderList[0].selected) {
      orders = this.OrderList.filter((i) => {
        return i.value != '' && i.selected == true
      }).map((i) => {
        return i.value
      }).join();
    }
    console.log(orders);
    var statusArr = [];
    var controls = Object.keys(this.form1.controls);
    controls.forEach((i, index) => {
      if(this.form1.get(i).value){
        statusArr.push(this.productionStatusOptions[index].value);
      }
    });
    statuses = statusArr.join();
    console.log(statuses);
    const request: ExpectUnboxingDataRequest = {
      Account: this.UserAccount,
      MoldingStartDate: this.PouringFilterStartDate.split('-').join(''),
      MoldingEndDate: this.PouringFilterEndDate.split('-').join(''),
      ETDFilterStartDate: this.ETDFilterStartDate.split('-').join(''),
      ETDFilterEndDate: this.ETDFilterEndDate.split('-').join(''),
      UnboxingStartDate: this.UnboxingFilterStartDate.split('-').join(''),
      UnboxingEndDate: this.UnboxingFilterEndDate.split('-').join(''),
      FlaskText: this.FlaskText,
      ItemCodeText: this.ItemCodeText,
      ProductionOrderText: this.ProductionOrderText,
      orderType: orders,
      productionStatus: statuses
    };
    this.itemCount = 0;
    this.totalWeight = 0;
    this.rest.API_requestExpectUnboxingData(request).pipe(
      tap(res => {
        this.spinnerService.show();
        this.UnboxingData = res.processInfos1;
        this.UnboxingData.forEach(x =>{
          this.itemCount += x.Qty;
          this.totalWeight += x.Qty * x.UnitWeight;
        });
      })
    ).subscribe(() => this.spinnerService.hide());
  }
  /**
   *將搜尋條件轉至request中
   *
   * @memberof ProductionLineReportComponent
   */
  setRequest() {
    this.PouringFilterStartDate = this.PouringFilterStartDateSearchTerm;
    this.PouringFilterEndDate = this.PouringFilterEndDateSearchTerm;
    this.UnboxingFilterStartDate = this.UnboxingFilterStartDateSearchTerm;
    this.UnboxingFilterEndDate = this.UnboxingFilterEndDateSearchTerm;
    this.ETDFilterStartDate = this.ETDFilterStartDateSearchTerm;
    this.ETDFilterEndDate = this.ETDFilterEndDateSearchTerm;
    this.ProductionOrderText = this.ProductionOrderTextSearchTerm;
    this.ItemCodeText = this.ItemCodeTextSearchTerm;
    this.FlaskText = this.FlaskTextSearchTerm;
    const orderValues = Object.values(this.form.controls);
    this.OrderList.forEach((i, index) => {
      i.selected = orderValues[index].value;
    });
  }

  /**
   *將搜尋條件返回popup
   *
   * @memberof ProductionLineReportComponent
   */
  orderStringToSearchTerm(): void {
    const controls = Object.keys(this.form.controls);
    this.OrderList.forEach((i, index) => {
      this.form.get(controls[index]).setValue(i.selected, { emitEvent: false, onlySelf: true })
    });
  }

  /**
   *清除搜尋條件
   *
   * @memberof ProductionLineReportComponent
   */
  onClear() {
    this.ProductionOrderTextSearchTerm = '';
    this.PouringFilterStartDateSearchTerm = '';
    this.PouringFilterEndDateSearchTerm = '';
    this.ETDFilterStartDateSearchTerm = '';
    this.ETDFilterEndDateSearchTerm = '';
    this.UnboxingFilterStartDateSearchTerm = '';
    this.UnboxingFilterEndDateSearchTerm = '';
    this.FlaskTextSearchTerm = '';
    this.ItemCodeTextSearchTerm = '';
    this.ProductionOrderTextSearchTerm = '';
    this.OrderList.forEach((i) => {
      i.selected = false;
    });
  }
}

