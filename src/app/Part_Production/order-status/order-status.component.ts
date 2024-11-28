import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { ProcessData, MainProductionOrder } from 'src/app/Model/production';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { ProcessDataListRequest } from 'src/bin/processDataListRequest';
import { ProductionStateListDataRequest } from 'src/bin/productionStateListDataRequest';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent {
  fileName: string = "ExcelSheet.xlsx";
  constructor(
    public rest: ProdutionService,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) {
  }
  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  ProductionList: Array<ProcessData> = [];
  public MakeOrderList: Array<MainProductionOrder>;
  Moldingdata: Array<any>;
  MoldingState: string = 'all';
  MoldingSearchtxt: string = "";
  MoldingStartday: string = "";
  MoldingEndday: string = "";
  MoldingProductionLine: string = "全部";

  Asemblingdata: Array<any>;
  AsemblingState: string = 'all';
  AsemblingSearchtxt: string = "";
  AsemblingStartday: string = "";
  AsemblingEndday: string = "";
  AsemblingProductionLine: string = "全部";

  Pouringdata: Array<any>;
  PouringSearchtxt: string = "";
  PouringStartday: string = "";
  PouringEndday: string = "";
  MoldTrackingState       :string = "";
  MoldTrackInOutDate      :string = "";
  AssemblingTrackingState :string = "";
  AssemblingTrackInOutDate:string = "";
  PouringTrackingState    :string="";
  PouringTrackInOutDate   :string="";
  ngOnInit(): void {
    this.GetData().pipe(
      switchMap(() => {
        return this.GetProductionList()
      })
    ).subscribe();
  }

  clearAll(){
    //alert('clearAll');
    // this.MoldTrackingState = "";
    // this.MoldTrackInOutDate = "";
    // this.AssemblingTrackingState = "";
    // this.AssemblingTrackInOutDate = "";
    // this.PouringTrackingState = "";
    // this.PouringTrackInOutDate = "";
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  GetData() {
    this.spinnerService.show()
    const request: ProductionStateListDataRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)

    };
    return this.rest.apiProductionStateListData(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        var date = new Date();
        this.MoldTrackInOutDate = this.formatDate(date);
        this.AssemblingTrackInOutDate = this.formatDate(date);
        this.PouringTrackInOutDate = this.formatDate(date);
        this.MakeOrderList = res.ScheduleList;
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }
  GetProductionList() {
    this.spinnerService.show();
    let MoldingsGroups = Array.from(new Set(this.MakeOrderList.map(item => item.MoldingLineName)));
    let AsemblingsGroups = Array.from(new Set(this.MakeOrderList.map(item => item.AsemblingLineName)));
    this.ProductionList.forEach(item => {
      if (MoldingsGroups.includes(item.ProductionLineName) || AsemblingsGroups.includes(item.ProductionLineName)) {
        item.IsActive = true;
      }
    });
    this.MoldingFilter();
    this.AsemblingFilter();
    this.PouringFilter();
    const request: ProcessDataListRequest = {
      Account: this.UserAccount
    }
    return this.rest.apiProcessDataList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ProductionList = res.Processes;
        console.log('ProductionList',this.ProductionList);
        let MoldingsGroups = Array.from(new Set(this.MakeOrderList.map(item => item.MoldingLineName)));
        console.log('MoldingsGroups',MoldingsGroups);
        let AsemblingsGroups = Array.from(new Set(this.MakeOrderList.map(item => item.AsemblingLineName)));
        this.ProductionList.forEach(item => {
          if (MoldingsGroups.includes(item.ProductionLineName) || AsemblingsGroups.includes(item.ProductionLineName)) {
            item.IsActive = true;
          }
        });
        this.MoldingFilter();
        this.AsemblingFilter();
        this.PouringFilter();
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }
  exportexcel(id:string){
    /* table id is passed over here */
    let element = document.getElementById(id);
    console.log(element);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    for (var i in ws) {
      console.log(ws[i]);
      if (typeof ws[i] != 'object') continue;
      // let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        font: {
          name: 'arial',
          sz: '14'
        },
        alignment: {
          vertical: 'center',
          horizontal: 'center',
          wrapText: '1', // any truthy value here
        },
        border: {
          right: {
            style: 'thin',
            color: '000000',
          },
          left: {
            style: 'thin',
            color: '000000',
          },
          top: {
            style: 'thin',
            color: '000000',
          },
          bottom: {
            style: 'thin',
            color: '000000',
          },
        },
      };

      // if (cell.c == 6) {
      //   // first column
      //   ws[i].s.numFmt = 'DD-MM-YYYY'; // for dates
      //   ws[i].z = 'DD-MM-YYYY';
      // } else {
      //   ws[i].s.numFmt = '00'; // other numbers
      // }

      // if (cell.r == 0) {
      //   // first row
      //   ws[i].s.border.bottom = {
      //     // bottom border
      //     style: 'thin',
      //     color: '000000',
      //   };
      // }

      // if (cell.r % 2) {
      //   // every other row
      //   ws[i].s.fill = {
      //     // background color
      //     patternType: 'solid',
      //     fgColor: { rgb: 'b2b2b2' },
      //     bgColor: { rgb: 'b2b2b2' },
      //   };
      // }
    }
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    if (id == "MoldingTable")
    {
      this.fileName = "造模";
    }
    else if (id == "AssemblingTable")
    {
      this.fileName = "合模";
    }
    else if (id == "PouringTable")
    {
      this.fileName = "澆注";
    }
    this.fileName += this.formatDate(new Date());
    if (id == "MoldingTable" || id == "AssemblingTable")
    {
      if (id == "MoldingTable")
      {
        if (this.MoldingState == 'all')
        {
          this.fileName += "全部";
        }
        else if (this.MoldingState == 'undo')
        {
          this.fileName += "未完成";
          if (this.MoldTrackingState == 'notIn')
          {
            this.fileName += "未進站";
          }
          else if (this.MoldTrackingState == "in")
          {
            this.fileName += "已進站";
          }
        }
        else if (this.MoldingState == 'finish')
        {
          this.fileName += "已完成";
        }
      }
      else if (id == "AssemblingTable")
      {
        if (this.AsemblingState == 'all')
        {
          this.fileName += "全部";
        }
        else if (this.AsemblingState == 'undo')
        {
          this.fileName += "未完成";
          if (this.AssemblingTrackingState == 'notIn')
          {
            this.fileName += "未進站";
          }
          else if (this.AssemblingTrackingState == "in")
          {
            this.fileName += "已進站";
          }
        }
        else if (this.AsemblingState == 'finish')
        {
          this.fileName += "已完成";
        }
      }
    }
    else if (id == "PouringTable")
    {
      this.fileName += "澆注";
      if (this.PouringTrackingState == 'in')
      {
        this.fileName += "已進站";
      }
      else if (this.PouringTrackingState == 'out')
      {
        this.fileName += "已完成";
      }
    }
    this.fileName += ".xlsx";
    /* save to file */
    XLSX.writeFile(wb, this.fileName,);
  }
  MoldingFilter() {
    this.Moldingdata = this.MakeOrderList.filter(x => (x.ProductionHeadCode != '' && x.ProductionOrderCode != '') &&
      (x.ProductionOrderCode.includes(this.MoldingSearchtxt) || x.ItemCode.includes(this.MoldingSearchtxt) || x.PartDesc.includes(this.MoldingSearchtxt) || x.CustomerName.includes(this.MoldingSearchtxt)) &&
      ((this.MoldingState == "finish" && (x.MoldingFinishCode == 'Y' || x.MoldingFinishCode == 'y'
        // &&
        // (this.MoldTrackingState == "" || (this.MoldTrackingState == 'in' && x.MoldingFinishDate == this.MoldTrackInOutDate))
      )) ||
        (this.MoldingState == "undo" //&& (x.MoldingFinishCode != 'Y' && x.MoldingFinishCode != 'y')
          // &&
          // (this.MoldTrackingState == "" || (this.MoldTrackingState == "notIn" && x.MoldingStartDate == ""))
        //)
        ) ||
        this.MoldingState == "all") &&
      (this.MoldingStartday == "" || this.MoldingStartday.replace(/\-/g, '') <= x.SchedulingDate) &&
      (this.MoldingEndday == "" || this.MoldingEndday.replace(/\-/g, '') >= x.SchedulingDate) &&
      (this.MoldingProductionLine == "全部" || x.MoldingLineName == this.MoldingProductionLine )
    );
    this.Moldingdata = this.Moldingdata.filter(x=> x.MoldingLineName != '' && x.MoldingLineName != null);
    if (this.MoldingState == 'all' || this.MoldingState == 'finish')
    {
      this.MoldTrackingState = '';
    }
    if (this.MoldingState == 'undo')
    {
      this.Moldingdata = this.Moldingdata.filter(x=> x.MoldingFinishDate == '');
      if (this.MoldTrackingState == 'notIn')
      {
        this.Moldingdata = this.Moldingdata.filter(x=> x.MoldingStartDate == '');
      }
      else if (this.MoldTrackingState == 'in')
      {
        this.Moldingdata = this.Moldingdata.filter(x=> x.MoldingStartDate == this.MoldTrackInOutDate.split('-').join(''));
      }
    }
    else if (this.MoldingState == 'finish')
    {
      this.Moldingdata = this.Moldingdata.filter(x=> x.MoldingFinishDate == this.MoldTrackInOutDate.split('-').join(''));
    }
  }
  AsemblingFilter() {
    this.Asemblingdata = this.MakeOrderList.filter(x =>
      (x.ProductionOrderCode.includes(this.AsemblingSearchtxt) || x.ItemCode.includes(this.AsemblingSearchtxt) || x.PartDesc.includes(this.AsemblingSearchtxt) || x.CustomerName.includes(this.AsemblingSearchtxt)) &&
      ((this.AsemblingState == "finish" && (x.AsemblingFinishCode == 'Y' || x.AsemblingFinishCode == 'y')) ||
        (
          this.AsemblingState == "undo" //&& (x.AsemblingFinishCode != 'Y' && x.AsemblingFinishCode != 'y')
        ) ||
        this.AsemblingState == "all") &&
      (this.AsemblingStartday == "" || this.AsemblingStartday.replace(/\-/g, '') <= x.SchedulingDate) &&
      (this.AsemblingEndday == "" || this.AsemblingEndday.replace(/\-/g, '') >= x.SchedulingDate) &&
      (this.AsemblingProductionLine == "全部" || this.AsemblingProductionLine == x.AsemblingLineName)
    )
    this.Asemblingdata = this.Asemblingdata.filter(x=> x.AsemblingLineName != '' && x.AsemblingLineName != null);
    if (this.AsemblingState == 'all' || this.AsemblingState == 'finish')
      {
        this.AssemblingTrackingState = '';
      }
    if (this.AsemblingState == 'undo')
      {
        this.Asemblingdata = this.Asemblingdata.filter(x=> x.AsemblingFinishDate == '');
        if (this.AssemblingTrackingState == 'notIn')
        {
          this.Asemblingdata = this.Asemblingdata.filter(x=> x.AsemblingStartDate == '');
        }
        else if (this.AssemblingTrackingState == 'in')
        {
          this.Asemblingdata = this.Asemblingdata.filter(x=> x.AsemblingStartDate == this.AssemblingTrackInOutDate.split('-').join(''));
        }
      }
      else if (this.AsemblingState == 'finish')
      {
        this.Asemblingdata = this.Asemblingdata.filter(x=> x.AsemblingFinishDate == this.AssemblingTrackInOutDate.split('-').join(''));
      }
  }
  PouringFilter() {
    this.Pouringdata = this.MakeOrderList.filter(x =>
      (x.ProductionOrderCode.includes(this.PouringSearchtxt) || x.ItemCode.includes(this.PouringSearchtxt) || x.PartDesc.includes(this.PouringSearchtxt) || x.CustomerName.includes(this.PouringSearchtxt)) &&
      (this.PouringStartday == "" || this.PouringStartday.replace(/\-/g, '') <= x.SchedulingDate) &&
      (this.PouringEndday == "" || this.PouringEndday.replace(/\-/g, '') >= x.SchedulingDate)
    )
    this.Pouringdata = this.Pouringdata.filter(x=> x.PouringLineName != '' && x.PouringLineName != null);
    if (this.PouringTrackingState == 'in')
    {
      this.Pouringdata = this.Pouringdata.filter(x=> x.PouringStartDate == this.PouringTrackInOutDate.split('-').join(''));
    }
    else if (this.PouringTrackingState == 'out')
    {
      this.Pouringdata = this.Pouringdata.filter(x=> x.PouringFinishDate == this.PouringTrackInOutDate.split('-').join(''));
    }
  }
  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}

