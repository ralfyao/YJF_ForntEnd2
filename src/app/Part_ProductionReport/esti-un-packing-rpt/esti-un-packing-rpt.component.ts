// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-esti-un-packing-rpt',
//   templateUrl: './esti-un-packing-rpt.component.html',
//   styleUrls: ['./esti-un-packing-rpt.component.css']
// })
// export class EstiUnPackingRptComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { StatuList } from './../../Part_RFQ_Result/rfq-supplier-status/rfq-supplier-status.component';
import { Component, OnInit } from '@angular/core';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpectUnboxingDataRequest } from 'src/bin/expectUnboxingDataRequest';
import { switchMap, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExpectUnboxingDataResponseProcessInfos } from 'src/bin/expectUnboxingDataResponseProcessInfos';

@Component({
  selector: 'app-esti-un-packing-rpt',
  templateUrl: './esti-un-packing-rpt.component.html',
  styleUrls: ['./esti-un-packing-rpt.component.css']
})
export class EstiUnPackingRptComponent implements OnInit {
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
  UnpackingPlanStartDate2:string = "";
  UnpackingPlanStartDate2End:string = "";
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
  subTotal:Map<string, number> = new Map<string, number>();
  keys:Array<string> = new Array<string>();
  UnboxingDataByGroup: Map<string, Array<ExpectUnboxingDataResponseProcessInfos>>;
  barChartOptions3 : any
   = {
    scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        ticks:{
          beginAtZero:true
        },
        position: 'left',
        barThickness: 10
      }]
    }
  }
  barChartLegend2 = false;
  chartData:any[] = [];
  chartWeightData:number[] = [];
  weight:number = 0;;
  barChartColors2: Array<any> = [
    { backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)', borderWidth: 2 },//Red
    { backgroundColor: 'rgba(54, 162, 255, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2 },//Blue
    { backgroundColor: 'rgba(221, 179, 75, 0.2)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 2 },//Yellow
    { backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2 }
  ];
  barChartType2 = 'bar';
  productionStatusOptions:Array<any> = [
    {
      itemName:"未生產",
      value:"1",
      selected:true
    },
    {
      itemName:"已生產",
      value:"3",
      selected:true
    },
    {
      itemName:"已完工",
      value:"Y",
      selected:false
    },
    {
      itemName:"指定完工",
      value:"y",
      selected:false
    }
  ];
  ngOnInit(): void {
    this.GetData();
  }

  calculateSubtotalWeight(data: any[], column:string): number {
    return data.map(data => data).reduce((acc, item) => acc + (item.UnitWeight * item.Qty / 1000), 0);
  }

  calculateSubtotalQty(data: any[], column:string): number {
    return data.map(data => data).reduce((acc, item) => acc + item.Qty, 0);
  }
  GetData() {
    this.spinnerService.show();
    const request: ExpectUnboxingDataRequest = {
      Account: this.UserAccount,
      MoldingStartDate: this.PouringFilterStartDate,
      MoldingEndDate: this.PouringFilterEndDate,
      ETDFilterStartDate: this.ETDFilterStartDate,
      ETDFilterEndDate: this.ETDFilterEndDate,
      UnboxingPlanStartDate2:this.UnpackingPlanStartDate2,
      UnboxingPlanStartDate2End:this.UnpackingPlanStartDate2End,
      UnboxingStartDate: this.UnboxingFilterStartDate,
      UnboxingEndDate: this.UnboxingFilterEndDate,
      ProductionOrderText: this.ProductionOrderText,
      ItemCodeText: this.ItemCodeText,
      FlaskText: this.FlaskText,
      orderType: '',
      productionStatus:'1,3'
    }
    this.itemCount = 0;
    this.totalWeight = 0;
    this.chartData = [];
    this.chartWeightData = [];
    this.rest.API_requestExpectUnboxingData2(request).pipe(
      tap(res => {
        this.UnboxingData = res.processInfos;
        this.UnboxingDataByGroup = res.processInfoByGroup;
        this.subTotal = new Map<string, number>();
        const keyStr:string[] = [];
        Object.keys(this.UnboxingDataByGroup).forEach(key=>{
          this.keys.push(key);
          this.weight = 0;
          this.UnboxingDataByGroup[key].forEach(element => {
            this.weight += element.Qty * element.UnitWeight;
          });
          this.chartWeightData.push(this.weight);
        })
        this.chartData.push({
          data:this.chartWeightData,
          label:"總重量"
        });
        // this.chartData.push({
        //   data:[],
        //   label:"",
        //   type:'line',
        //   fill:false
        // });
        // console.log(this.keys);
        this.UnboxingData.forEach(res=>{
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

  ExportDataByDay(UnpackingPlanStartDate2:string) {
    this.UnpackingPlanStartDate2 = UnpackingPlanStartDate2;
    this.UnpackingPlanStartDate2End = UnpackingPlanStartDate2;
    this.spinnerService.show();
    let orders = '';
    if (!this.OrderList[0].selected) {
      orders = this.OrderList.filter((i) => {
        return i.value != '' && i.selected == true
      }).map((i) => {
        return i.value
      }).join();
    }
    this.rest.API_ExportExpectUnboxing2(this.UserAccount,
      this.PouringFilterStartDate.replace(/-/g, ''),
      this.PouringFilterEndDate.replace(/-/g, ''),
      this.ETDFilterStartDate.replace(/-/g, ''),
      this.ETDFilterEndDate.replace(/-/g, ''),
      this.UnboxingFilterStartDate.replace(/-/g, ''),
      this.UnboxingFilterEndDate.replace(/-/g, ''),
      this.UnpackingPlanStartDate2.replace(/-/g, ''),
      this.UnpackingPlanStartDate2End.replace(/-/g, ''),
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
    this.rest.API_ExportExpectUnboxingTotal(this.UserAccount,
      this.PouringFilterStartDate.replace(/-/g, ''),
      this.PouringFilterEndDate.replace(/-/g, ''),
      this.ETDFilterStartDate.replace(/-/g, ''),
      this.ETDFilterEndDate.replace(/-/g, ''),
      this.UnboxingFilterStartDate.replace(/-/g, ''),
      this.UnboxingFilterEndDate.replace(/-/g, ''),
      this.UnpackingPlanStartDate2.replace(/-/g, ''),
      this.UnpackingPlanStartDate2End.replace(/-/g, ''),
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
      UnboxingPlanStartDate2: this.UnpackingPlanStartDate2.split('-').join(''),
      UnboxingPlanStartDate2End: this.UnpackingPlanStartDate2End.split('-').join(''),
      FlaskText: this.FlaskText,
      ItemCodeText: this.ItemCodeText,
      ProductionOrderText: this.ProductionOrderText,
      orderType: orders,
      productionStatus: statuses
    };
    this.itemCount = 0;
    this.totalWeight = 0;
    this.rest.API_requestExpectUnboxingData2(request).pipe(
      tap(res => {
        this.spinnerService.show();
        this.UnboxingData = res.processInfos;
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
    this.UnpackingPlanStartDate2 = this.UnpackingPlanStartDate2;
    this.UnpackingPlanStartDate2End = this.UnpackingPlanStartDate2End;
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
    this.UnpackingPlanStartDate2 = '';
    this.UnpackingPlanStartDate2End = '';
    this.FlaskTextSearchTerm = '';
    this.ItemCodeTextSearchTerm = '';
    this.ProductionOrderTextSearchTerm = '';
    this.OrderList.forEach((i) => {
      i.selected = false;
    });
  }
}

