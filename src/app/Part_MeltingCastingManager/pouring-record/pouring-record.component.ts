import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { MaterialColumn, PouringWeight, QueryMaterialStock } from 'src/app/Model/PouringData';
import { PouringDataWeightRep, PouringMaterialRep } from 'src/app/Model/PouringoutData';
import { PermissionService } from 'src/app/Service/permission.service';
import { PouringDataService } from 'src/app/Service/PouringData.service';

@Component({
  selector: 'app-pouring-record',
  templateUrl: './pouring-record.component.html',
  styleUrls: ['./pouring-record.component.css']
})
export class PouringRecordComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [], label: '', yAxisID: '' },
  ];
  public lineChartLabels: Label[] = new Array<string>();
  public lineChartOptions: (ChartOptions) = {
    responsive: true,

    scales: {
      yAxes: [{

        ticks: {
          fontSize: 18
        },
        position: 'left',
        id: 'A'
      },
      {
        ticks: {
          fontSize: 18,
          max: 1,
          min: 0.5

        },
        position: 'right',
        id: 'B'
      }
      ],
      xAxes: [{
        ticks: {
          fontSize: 18
        }
      }]
    },
    legend: {
      position: "top",
      labels: {
        fontSize: 18
      }
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  PouringRecord: Array<PouringWeight> = new Array<PouringWeight>();
  maxvalue1: number = 0;
  minvalue1: number = 0;
  maxvalue2: number = 0;
  minvalue2: number = 0;
  CurrentMaterialStockList: Array<QueryMaterialStock> = new Array<QueryMaterialStock>();
  MaterialStockList: Array<QueryMaterialStock> = new Array<QueryMaterialStock>();
  CurrentMaterial: QueryMaterialStock = new QueryMaterialStock();
  MaterialList: Array<string> = new Array<string>();
  ShowSheet = true;
  TotalCount: number;
  Page: number = 1;
  PouringDataWeightReps: Array<PouringDataWeightRep> = new Array<PouringDataWeightRep>();

  constructor(
    @Inject(DOCUMENT) public document,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public premanager: PermissionService,
    private rest: PouringDataService
  ) { }

  ngOnInit() {
    this.QueryPouringRecord();
    this.QueryMaterialStockList();
    this.QueryMaterailList(1);
  }

  QueryMaterailList(page: any) {
    this.spinnerService.show();
    this.Page = page;
    this.rest.API_QueryPouringMaterialList(this.session.retrieve(LoginSessionEnum.UserAccount), 20, this.Page).then(
      (data) => {
        this.PouringDataWeightReps = data['PouringDataWeightReps'];
        this.TotalCount = data['TotalCount'];
        this.spinnerService.hide();
      }
    );
  }



  QueryPouringRecord() {
    this.spinnerService.show();
    this.rest.API_PouringWeightQuery(this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.PouringRecord = data['pouringWeights'];
        this.FilterGraphic('M');
        this.spinnerService.hide();
      }
    );
  }


  QueryMaterialStockList() {
    this.spinnerService.show();
    this.rest.API_QueryMaterialStockList(this.session.retrieve(LoginSessionEnum.UserAccount)).then(
      (data) => {
        this.CurrentMaterialStockList = data['CurrentMaterialStockList'];
        this.MaterialList = this.CurrentMaterialStockList.map(x => x.MaterialName);
        this.MaterialStockList = data['MaterialStockList'];
        this.spinnerService.hide();
      }
    );
  }

  materialTypeChange(ev: string) {
    this.CurrentMaterial = this.CurrentMaterialStockList.filter(x => x.MaterialName == ev)[0];
    this.FilterGraphic('TotalMaterial');
  }

  FilterGraphic(type: string) {
    const newrow1 = Array<number>();
    const newrow2 = Array<number>();
    const datnow = new Date(Date.now());
    let datehalfyear = new Date();
    this.lineChartLabels = new Array<string>();
    switch (type) {
      case 'M':
        this.ShowSheet = false;
        datehalfyear.setDate(datnow.getDate() - 90);
        this.PouringRecord.forEach(x => {
          if (!this.lineChartLabels.includes(DatetoyyyyMM(x.Date))) {
            this.lineChartLabels.push(DatetoyyyyMM(x.Date));
            var xx = this.PouringRecord.filter(y => DatetoyyyyMM(y.Date) == DatetoyyyyMM(x.Date)).map(el => el.BatchWeight / 1000).reduce((a, b) => a + b);
            var yy = this.PouringRecord.filter(y => DatetoyyyyMM(y.Date) == DatetoyyyyMM(x.Date)).map(el => el.ProductWeight / 1000).reduce((a, b) => a + b);
            newrow1.push(yy);
            newrow2.push(Math.round(yy / xx * 100) / 100);
          }
        });
        this.lineChartData = [
          { data: newrow1, label: "澆注重量", yAxisID: 'A' },
          { data: newrow2, label: "步留率", yAxisID: 'B' },
        ];
        break;
      case 'D':
        this.ShowSheet = false;
        datehalfyear.setDate(datnow.getDate() - 90);

        this.PouringRecord.forEach(x => {
          if (!this.lineChartLabels.includes(DatetoyyyyMMdd(x.Date)) && Number(DatetoyyyyMMdd(datehalfyear)) <= Number(DatetoyyyyMMdd(x.Date))) {
            this.lineChartLabels.push(DatetoyyyyMMdd(x.Date));
            var xx = this.PouringRecord.filter(y => DatetoyyyyMMdd(y.Date) == DatetoyyyyMMdd(x.Date)).map(el => el.BatchWeight / 1000).reduce((a, b) => a + b);
            var yy = this.PouringRecord.filter(y => DatetoyyyyMMdd(y.Date) == DatetoyyyyMMdd(x.Date)).map(el => el.ProductWeight / 1000).reduce((a, b) => a + b);
            newrow1.push(xx);
            newrow2.push(Math.round(yy / xx * 100) / 100);
          }
        });
        this.lineChartData = [
          { data: newrow1, label: "澆注重量", yAxisID: 'A' },
          { data: newrow2, label: "步留率", yAxisID: 'B' },
        ];
        break;
      case 'TotalMaterial':
        this.ShowSheet = false;
        this.MaterialStockList.filter(x => x.MaterialName == this.CurrentMaterial.MaterialName).forEach(x => {
          if (!this.lineChartLabels.includes(DatetoyyyyMMdd(x.StockOutDate))) {
            this.lineChartLabels.push(DatetoyyyyMMdd(x.StockOutDate));
            newrow1.push(Math.round(x.RunningStock));
          }
        });
        this.lineChartData = [
          { data: newrow1, label: this.CurrentMaterial.MaterialName, yAxisID: 'A' }
        ];
        break;
      case 'MaterialRecord':
        this.ShowSheet = !this.ShowSheet;
        break;
    }
  }
  yyyyMMdd(newdate: Date) {
    var formatedate = new Date(newdate);
    if (formatedate != null) {
      var year = formatedate.getFullYear().toString();
      var month = (formatedate.getMonth() + 1).toString();
      while (month.length < 2) {
        month = "0" + month;
      }
      var odate = formatedate.getDate().toString();
      while (odate.length < 2) {
        odate = "0" + odate;
      }
      var yyyyMMdd = year + month + odate;
    }
    return yyyyMMdd;
  }
}

function DatetoyyyyMMdd(newdate: Date) {

  var formatedate = new Date(newdate);
  if (formatedate != null) {
    var year = formatedate.getFullYear().toString();
    var month = (formatedate.getMonth() + 1).toString();
    while (month.length < 2) {
      month = "0" + month;
    }
    var odate = formatedate.getDate().toString();
    while (odate.length < 2) {
      odate = "0" + odate;
    }
    var yyyyMMdd = year + month + odate;
  }
  return yyyyMMdd;
}
function DatetoyyyyMM(newdate: Date) {

  var formatedate = new Date(newdate);
  if (formatedate != null) {
    var year = formatedate.getFullYear().toString();
    var month = (formatedate.getMonth() + 1).toString();
    while (month.length < 2) {
      month = "0" + month;
    }
    var odate = formatedate.getDate().toString();
    while (odate.length < 2) {
      odate = "0" + odate;
    }
    var yyyyMM = year + month;
  }
  return yyyyMM;
}
