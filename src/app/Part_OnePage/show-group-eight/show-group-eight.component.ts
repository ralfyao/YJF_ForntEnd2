import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MainProductionOrder } from 'src/app/Model/production';
import { ProdutionReportService } from 'src/app/Service/ProductionReport.service';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { ProductionChartDataRequest } from 'src/bin/productionChartDataRequest';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-show-group-eight',
  templateUrl: './show-group-eight.component.html',
  styleUrls: ['./show-group-eight.component.css']
})
export class ShowGroupEightComponent implements OnInit {
  //造模8、合模8-1、合模3-2 生產圖表
  constructor(
    public rest: ProdutionReportService,
    public rest2: ProdutionService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  Loading: boolean = false;
  ActivePage = 0;

  ChartLegend = true;
  public barChartColors: Array<any> = [
    { backgroundColor: 'rgba(221, 179, 75, 0.2)', borderColor: 'rgba(255, 206, 86, 1)', borderWidth: 2 },
    { backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2 },
    { backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)', borderWidth: 2 },
    { backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2 },
  ];
  //#region 合模當月已完成
  AsemblingChartType = 'line';
  public barChartColors81: Array<any> = [
    { backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 2 }
  ];
  public barChartColors32: Array<any> = [
    { backgroundColor: 'rgba(153, 102, 255, 0.2)', borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2 }
  ];

  AsemblingChartLabels: string[] = [];
  finishAsembling81: number[] = [];
  finishAsembling32: number[] = [];

  public AsemblingChartData81: any[] = [
    {
      data: this.finishAsembling81,
      label: '當月累計完成數量',
      tension: 0
    }
  ];
  public AsemblingChartData32: any[] =
    [
      {
        data: this.finishAsembling32,
        label: '當月累計完成數量',
        tension: 0
      }
    ];

  public barChartOptions81: ChartConfiguration['options'] = {
    scales: {
      yAxes: [{
        id: 'A',

      }]
    },
    title: {
      text: '合模8-1組',
      fontSize: 40,
      display: true
    }

  }
  public barChartOptions32: ChartConfiguration['options'] = {
    scales: {
      yAxes: [{
        id: 'A',
      }]
    },
    title: {
      text: '合模3-2組',
      fontSize: 40,
      display: true
    }
  }
  //#endregion

  //#region 待合模數量
  todoAsembling: number[] = [];
  public todoAsemblingChartData: any[] = [
    {
      data: this.todoAsembling,
      label: '待合模數量',
      tension: 0
    }
  ];
  public barChartOptions: ChartConfiguration['options'] = {
    scales: {
      yAxes: [{
        id: 'A',
        ticks: {
          beginAtZero: true,   // minimum value will be 0.
        }
      }]
    },
    title: {
      text: '待合模數量',
      display: true,
      fontSize: 40
    },
    legend: {
      display: false
    }
  }
  TodoAsemblingChartLabels: string[] = ["合模8-1組", "合模3-2組"];
  //#endregion

  //#region 造模8組
  GroupScheduleData: Array<MainProductionOrder>;
  public MoldingChartLabels: string[] = [];

  allMoldings: number[] = [];
  finishMoldings: number[] = [];
  undoMoldings: number[] = [];
  completionrates: number[] = [];
  public MoldingbarChartData: any[] = [
    { data: this.allMoldings, label: '預排', yAxisID: 'A' },
    { data: this.finishMoldings, label: '已完成', yAxisID: 'A' },
    { data: this.undoMoldings, label: '未完成', yAxisID: 'A' },
    /* { data: this.completionrates, label: '完成率', yAxisID: 'B', type: 'line', fill: false } */
  ];
  public ChartOptions: any = {
    scales: {
      yAxes: [{
        id: 'A',
        type: 'linear',
        position: 'left',
        responsive: true,
        barThickness: 10
      }, {
        id: 'B',
        type: 'linear',
        position: 'right',
        ticks: {
          beginAtZero: true,   // minimum value will be 0.
          steps: 10,
          stepValue: 5,
          max: 100
        },
        gridLines: {
          display: false
        }
      }]
    },
    title: {
      text: '造模8組',
      display: true,
      fontSize: 40,
    },
    legend: {
      display: true
    }
  }

  //#endregion


  ngOnInit(): void {
    this.GetDate();
    //10分鐘重新抓一次資料
    setInterval((): void => {
      this.GetDate();
    }, 600000);
    //20秒換頁
    setInterval((): void => {
      if (this.ActivePage == 2) {
        this.ActivePage = 1
      } else {
        this.ActivePage = 2;
      }
    }, 20000);
  }
  GetDate() {
    this.Loading = true;
    this.setAsemblingData();
    this.setMoldingData();
  }
  public setAsemblingData() {
    //合模
    this.rest.API_AsemblingChartData().then(
      (data) => {
        const AsemblingFinishData: Array<MainProductionOrder> = data["AsemblingFinishData"];
        const AsemblingTodoData: Array<MainProductionOrder> = data["AsemblingTodoData"];

        //#region 計算合模當月已完成

        //合模8-1
        let AsemblingFinishList81 = AsemblingFinishData.filter(x => x.AsemblingLineCode.trim() == "1110")
        //合模3-2
        let AsemblingFinishList32 = AsemblingFinishData.filter(x => x.AsemblingLineCode.trim() == "1108")


        arrayremove(this.AsemblingChartLabels);
        arrayremove(this.finishAsembling81);
        arrayremove(this.finishAsembling32);
        for (let index = 8; index > -1; index--) {
          let date: Date = new Date(new Date().setDate(new Date().getDate() - index))
          //非上班日
          if ([0, 6].includes(date.getDay())) {
            continue;
          }

          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

          this.AsemblingChartLabels.push(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());

          let Asemblingdata81: number = 0;
          AsemblingFinishList81.filter(x => x.AsemblingFinishDate <= this.yyyyMMdd(date) && x.AsemblingFinishDate >= this.yyyyMMdd(firstDay)).forEach(element => {
            Asemblingdata81 += element.ProductWeight;
          });
          this.finishAsembling81.push(Asemblingdata81);

          let Asemblingdata32: number = 0;
          AsemblingFinishList32.filter(x => x.AsemblingFinishDate <= this.yyyyMMdd(date) && x.AsemblingFinishDate >= this.yyyyMMdd(firstDay)).forEach(element => {
            Asemblingdata32 += element.ProductWeight;
          });
          this.finishAsembling32.push(Asemblingdata32);


        }
        //#endregion
        //#region 計算待合模數量
        arrayremove(this.todoAsembling);
        //合模8-1
        let SumTodoWeight81: number = 0;
        AsemblingTodoData.filter(x => x.AsemblingLineCode.trim() == "1110").forEach(element => {
          SumTodoWeight81 += element.ProductWeight;
        });
        this.todoAsembling.push(SumTodoWeight81);
        //合模3-2
        let SumTodoWeight32: number = 0;
        AsemblingTodoData.filter(x => x.AsemblingLineCode.trim() == "1108").forEach(element => {
          SumTodoWeight32 += element.ProductWeight;
        });
        this.todoAsembling.push(SumTodoWeight32);
        //#endregion
      }
    ).finally(() => { this.Loading = false; });
  }
  public setMoldingData() {
    this.Loading = true
    const request: ProductionChartDataRequest = {
      Account: 'admin'
    }
    this.rest2.apiProductionChartData(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        const AllScheleList = res.allscheles;
        //造模8組
        let GroupScheduleData = AllScheleList.filter(x => x.MoldingLineName == "造模8組" && x.MoldingFinishCode != '');
        arrayremove(this.MoldingChartLabels);
        arrayremove(this.allMoldings);
        arrayremove(this.undoMoldings);
        arrayremove(this.finishMoldings);
        arrayremove(this.completionrates);
        this.changeDetectorRef.detectChanges();//先更新清空畫面才不會錯亂
        //放下方label
        this.MoldingChartLabels = Array.from(new Set(GroupScheduleData.filter(x => x.MoldingFinishCode != "Y"
          && x.MoldingFinishCode != "y"
          && x.ProductionOrderStatus != "y"
          && x.ProductionOrderStatus != "Y"
          && x.SchedulingDate != null).map(x => DateStringFormat(x.SchedulingDate))));

        this.MoldingChartLabels.sort();
        this.MoldingChartLabels.forEach(label => {
          let allMolding: number = 0;
          let finishMolding: number = 0;
          let undoMolding: number = 0;
          GroupScheduleData.filter(x => x.SchedulingDate == label.replace(/\//g, '')).forEach(item => {
            allMolding += item.ProductWeight * item.PlanQTY;
            if (item.MoldingFinishCode == "Y" || item.MoldingFinishCode == "y" || item.ProductionOrderStatus == "y" || item.ProductionOrderStatus == "Y") {
              finishMolding += item.ProductWeight * item.PlanQTY;
            } else {
              undoMolding += item.ProductWeight * item.PlanQTY;
            }
          })

          this.allMoldings.push(allMolding);
          this.undoMoldings.push(undoMolding);
          this.finishMoldings.push(finishMolding);
          this.completionrates.push(Math.round(finishMolding / allMolding * 10000) / 100);
          this.Loading = false;
        })
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.Loading = false;
        return of()
      })
    ).subscribe()
  }
  yyyyMMdd(date: Date) {
    var y = date.getFullYear().toString();
    var m = (date.getMonth() + 1).toString();
    var d = date.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyyMMdd = y + m + d;
    return yyyyMMdd;
  }
}
function DateStringFormat(date) {
  return date.substring(0, 4) + '/' + date.substring(4, 6) + '/' + date.substring(6, 8)
}
function arrayremove(array) {
  let length = array.length;
  for (let index = 0; index < length; index++) {
    array.splice(0, 1);
  }
}
