import { Sort } from '@angular/material/sort';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { CusOrder, POMOCTAPUR, MainProductionOrder, PurchaseRecord, StockRecord } from 'src/app/Model/production';
import { POMOCTAPURCheckListRequest } from 'src/bin/pOMOCTAPURCheckListRequest';
import { catchError, tap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { ShowRecordByPartNoRequest } from 'src/bin/showRecordByPartNoRequest';
import { ChangePODetailRequest } from 'src/bin/changePODetailRequest';

@Component({
  selector: 'app-customer-scheduling',
  templateUrl: './customer-scheduling.component.html',
  styleUrls: ['./customer-scheduling.component.css']
})
export class CustomerSchedulingComponent implements OnInit {
  POMOCPURList: Array<POMOCTAPUR> = new Array<POMOCTAPUR>();
  ShowOrderList: Array<POMOCTAPUR> = new Array<POMOCTAPUR>();
  SearchString: string = '';
  ProductionOrderList: Array<MainProductionOrder> = new Array<MainProductionOrder>();
  CusOrderList: Array<CusOrder> = new Array<CusOrder>();
  StockRecordList: Array<StockRecord> = new Array<StockRecord>();
  PurchaseRecordList: Array<PurchaseRecord> = new Array<PurchaseRecord>();
  selectPartNO: string = '';
  Tablesort: Sort = {
    active: '',
    direction: ''
  };

  constructor(
    @Inject(DOCUMENT) public document,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    public rest: ProdutionService,
  ) { }

  ngOnInit() {
    this.CallPOMOCTAPURCheckList().subscribe();
  }

  CallPOMOCTAPURCheckList() {
    const request: POMOCTAPURCheckListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.spinnerService.show();
    return this.rest.apiPOMOCTAPURCheckList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.POMOCPURList = res.POMOCTAPURCheckList;
        this.ShowOrderList = this.POMOCPURList.sort((a, b) =>
          (b.OrderQty - b.ProductionOrder - b.PurchasingOrder - b.StockQty) -
          (a.OrderQty - a.ProductionOrder - a.PurchasingOrder - a.StockQty)
        );
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }
  checkQTY(Rowitem: POMOCTAPUR) {
    const TotalQty = Rowitem.OrderQty - Rowitem.ProductionOrder - Rowitem.PurchasingOrder - Rowitem.StockQty;
    if (this.selectPartNO == Rowitem.PartNo) {
      return 'blue'
    }
    else if (TotalQty > 0) {
      return 'aquamarine'
    } else if (TotalQty < 0) {
      return 'darksalmon'
    } else {
      return 'white'
    }
  }
  checkFont(Rowitem: POMOCTAPUR) {
    if (this.selectPartNO == Rowitem.PartNo) {
      return 'white'
    }
    else {
      return 'black'
    }
  }

  SearchList(text: string) {
    text = text.toLocaleLowerCase();
    this.ShowOrderList = this.POMOCPURList.filter(x =>
      x.CusName.toLocaleLowerCase().includes(text) ||
      x.PartNo.toLocaleLowerCase().includes(text) ||
      x.PartDesc.toLocaleLowerCase().includes(text)
    );
  }
  ShowOrderRecordByPartNo(Partno: string) {
    this.spinnerService.show();
    const request: ShowRecordByPartNoRequest = {
      PartNo: Partno,
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiShowRecordByPartNo(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ProductionOrderList = res.ProductionOrderList;
        this.CusOrderList = res.CusOrderList;
        this.StockRecordList = res.StockRecordList;
        this.PurchaseRecordList = res.PurchaseRecordList;
        this.selectPartNO = Partno;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }
  CompareQuantity() {
    if (this.ShowOrderList.length > 0) {
      const wrongqty = this.ShowOrderList.filter(x => (x.OrderQty - x.ProductionOrder - x.PurchasingOrder - x.StockQty) > 0).length;
      const OrderQTY = this.ShowOrderList.length;
      return Math.round((1 - (wrongqty / OrderQTY)) * 100);
    }

  }

  FilterTable(ev: Sort) {
    this.Tablesort = ev;
    this.ShowOrderList.sort((a, b) => {
      const isAsc = this.Tablesort.direction === 'asc';
      switch (this.Tablesort.active) {
        case 'ProductionOrder':
          return compare(a.ProductionOrder, b.ProductionOrder, isAsc);
        case 'CusName':
          return compare(a.CusName, b.CusName, isAsc);
        case 'PartNo':
          return compare(a.PartNo, b.PartNo, isAsc);
        case 'OrderQty':
          return compare(a.OrderQty, b.OrderQty, isAsc);
        case 'PurchasingOrder':
          return compare(a.PurchasingOrder, b.PurchasingOrder, isAsc);
        case 'PartNo':
          return compare(a.StockQty, b.StockQty, isAsc);
      }
    });
  }
  ChangePO(item: CusOrder) {
    const request: ChangePODetailRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      POstatusList: item
    };
    this.rest.apiChangePODetail(request).subscribe();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
