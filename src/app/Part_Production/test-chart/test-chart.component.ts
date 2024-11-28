import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './test-chart.component.html',
  styleUrls: [ './test-chart.component.css' ]
})
export class TestChartComponent {
  title = 'ng2-charts-demo';
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 1065, 1059, 1080, 1081, 1056, 1055, 1040 ], label: 'Series A' },
      { data: [ 1028, 1048, 1040, 1019, 1086, 1027, 1090 ], label: 'Series B' }
    ]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true
  };

  constructor() {
  }

}
