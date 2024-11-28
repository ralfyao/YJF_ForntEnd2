import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { of } from 'rxjs';
import * as XLSX from 'xlsx';
import { catchError, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QueryProdCapacityRequest } from 'src/bin/queryProdCapacityRequest';
import { ProductionCapacity, ProductionCapacityDetailWO } from 'src/app/Model/production';
import { DecimalPipe } from '@angular/common';
// import { toThousandPipe } from 'src/app/utility/utility';

@Component({
  selector: 'app-production-capacity',
  templateUrl: './production-capacity.component.html',
  styleUrls: ['./production-capacity.component.css']
})
export class ProductionCapacityComponent implements OnInit {
  filterKey: number;

  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private rest: ProdutionService,
    private decimalPipe: DecimalPipe
  ) { }
  productionLineList:Array<string> = new Array<string>();
  productionLineNameList:Array<string> = new Array<string>();
  productionData:Record<string,Array<ProductionCapacity>>;
  showGroup:string='';
  startDate:string='';
  endDate:string = '';
  totalWeight:number = 0;
  totalQuantity:number = 0;
  account: string = this.session.retrieve(LoginSessionEnum.UserAccount);
  searchForm: FormGroup = new FormGroup({
  })
  queryForm:FormGroup ;
  formBuilder:FormBuilder;
  // decimalPipe:DecimalPipe;
  label:Array<string>;
  loadingWOData:Array<ProductionCapacityDetailWO> = new Array<ProductionCapacityDetailWO>();
  loadingWODataKeep:Array<ProductionCapacityDetailWO> = new Array<ProductionCapacityDetailWO>();
  fileName = 'ExcelSheet.xlsx';
  chartData:any[] = [{ data:undefined, }];
  barChartOptions2 : any
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
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartColors2: Array<any> = [
    { backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)', borderWidth: 2 },//Red
    { backgroundColor: 'rgba(54, 162, 255, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2 },//Blue
    { backgroundColor: 'rgba(221, 179, 75, 0.2)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 2 },//Yellow
    { backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2 }
  ];
  ngOnInit(): void {
    this.startDate = new Date().toISOString().slice(0, 10);
    // this.decimalPipe = new DecimalPipe("en-US");
    this.endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().slice(0, 10);
    this.reloadData();
  }
  reloadData(){
    this.productionLineList = [];
    this.productionLineNameList = [];
    this.productionData = null;
    const request:QueryProdCapacityRequest = {
      Account:this.account,
      StartDate:this.startDate.split('-').join(''),
      EndDate:this.endDate.split('-').join('')
    };
    this.showGroup = "電爐澆注";
    this.QueryProdCapacity(request).subscribe();
  }
  QueryProdCapacity(request:QueryProdCapacityRequest){
    this.spinnerService.show();
    return this.rest.apiQueryProductionCapacity(request).pipe(
      tap(res =>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg);
        }
        res.lineNameList.forEach(x => {
          this.productionLineNameList.push(x);
        });
        res.lineCodeList.forEach(x => {
          this.productionLineList.push(x);
        });
        this.productionData = res.loadingData;
        // this.showGroup = this.productionLineNameList[0];
        this.filtertable(this.showGroup);
        this.spinnerService.hide();
      }),
      catchError((res)=>{
        return of()
      })
    )
  }
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 10)
  }
  exportexcel() {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    console.log(element);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName,);
  }
  filtertable(item: string) {
    // alert(item);
    this.showGroup = item;
    var pouringStationName:string = "\u96fb\u7210\u6f86\u6ce8";
    this.label = [];
    this.loadingWOData = new Array<ProductionCapacityDetailWO>();
    this.chartData = [];
    const dataR:any[] = [];
    const dataFCD:any[] = [];

    // console.log("productionData:"+JSON.stringify(this.productionData[item]));
    const itemData = this.productionData[item].sort((x, y) => {
      if(parseInt(x.Date) > parseInt(y.Date))
      {
        return 1;
      }
      if(parseInt(x.Date) == parseInt(y.Date))
      {
        return 0;
      }
      if(parseInt(x.Date) < parseInt(y.Date))
      {
        return -1;
      }

    });
    // console.log("itemData:"+JSON.stringify(itemData));
    var limit:number[] = [];
    var capacity:number = 0;
    // 為了要畫出負荷限制的橫線，要加一個頭，資料是0
    this.label.push("start");
    limit.push(itemData[0].Capacity);
    dataR.push(0);
    if(this.showGroup == pouringStationName)
    {
      dataFCD.push(0);
    }
    this.totalWeight = 0;
    this.totalQuantity = 0;
    // group sum production by date
    const calculated = itemData.reduce((acc, item) =>{
      let accItem = acc.find(ai => ai.Date === item.Date);
      if (accItem){
        accItem.Production += item.Production;
        accItem.ProductionFC += item.ProductionFC;
        accItem.ProductionFCD += item.ProductionFCD;
      } else {
        acc.push(item);
      }
      return acc;
    }, []);
    // summary data of production by date
    calculated.forEach(x =>{
      if(this.label.indexOf(x.Date) == -1)
      {
        if (x.Production == 0)
          return;
        this.label.push(x.Date);
        // dct.set(x.Date, index);
        if(this.showGroup == pouringStationName)
        {
          dataR.push(x.ProductionFC);
          dataFCD.push(x.ProductionFCD);
        }
        else
        {
          dataR.push(x.Production);
        }
        this.totalWeight += x.Production;
        limit.push(x.Capacity);
        if(capacity == 0)
          capacity = x.Capacity;
        x.loadingWOData.forEach(xx => {
          if(xx.DetailSysId == x.DetailSysId && xx.ProdWeight > 0)
          {
            this.loadingWOData.push(xx);
            this.loadingWODataKeep.push(xx);
            this.totalQuantity += xx.Quantity;
          }
        });
        ;
      }
    });
     // 為了要畫出負荷限制的橫線，要加一個尾，資料是0
    this.label.push("end");
    limit.push(itemData[0].Capacity);
    dataR.push(0);
    if(this.showGroup == pouringStationName)
    {
      dataFCD.push(0);
      this.chartData.push({
        data:dataR,
        label:"FC",
        stack:'a'
      });
      // 產能負荷的橫線
      this.chartData.push({
        data:limit,
        label:'\u751f\u7522\u8ca0\u8377',
        type:'line',
        fill:false
      });
      this.chartData.push({
        data:dataFCD,
        label:"FCD",
        stack:'a'
      });
    }
    else
    {
      this.chartData.push({
        data:dataR,
        label:item
      });
      // 產能負荷的橫線
      this.chartData.push({
        data:limit,
        label:'\u751f\u7522\u8ca0\u8377',
        type:'line',
        fill:false
      });
    }

    console.log("dataR:"+JSON.stringify(dataR));

    this.filterKey = -1;
    this.barChartOptions2 = {
      responsive: true,
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          ticks:{
            beginAtZero:true
          },
          position: 'left',
          responsive: true,
          barThickness: 10
        }],
        xAxes:[
          {
            ticks:{
              min:itemData[0].Date,
              max:itemData[itemData.length - 1].Date// 限制圖表內容去頭與尾的label與資料
            }
          }
        ]
      },
      onClick:(event, elements, chart) => {
        if (elements[0]) {
          this.filterKey = elements[0]._index;
          this.loadingWOData = new Array<ProductionCapacityDetailWO>();
          this.totalWeight = 0;
          this.totalQuantity = 0;
          this.productionData[this.showGroup].forEach(element => {
            element.loadingWOData.forEach(xx =>{
              if(xx.ProdWeight > 0 && xx.CreateDate.substring(0,10).split('-').join('') == this.label[this.filterKey]){
                this.loadingWOData.push(xx);
                this.totalWeight += xx.ProdWeight;
                console.log("wo:"+xx.WorkOrder+","+xx.Quantity);
                this.totalQuantity += xx.Quantity;
              }
            });
            // this.totalWeight /= 1000;
          });
        }
      }
    }
  }
  getProductionLineList(){
    this.spinnerService.show();
    const request = {
      Account: this.account,
      WorkOrder:undefined
    };
    return this.rest.apiQueryProductionLine(request).pipe(
      tap(res =>{
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        res.LineCodeList.forEach((i) => {
          if(i.ProductiongLineName.toString().indexOf("    ") === -1)
          {
            this.productionLineList.push(i.ProductiongLineName);
          }
        });
        this.spinnerService.hide();
      }),catchError((res) => {
        return of()
      })
    );
  }
}
