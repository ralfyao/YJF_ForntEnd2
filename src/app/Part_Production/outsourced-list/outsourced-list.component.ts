import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
import { Outsourced } from 'src/app/Model/production';
import { OutsourcedDataRequest } from 'src/bin/outsourcedDataRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { BatchSFCForOutsourcedReqeust } from 'src/bin/batchSFCForOutsourcedReqeust';
@Component({
  selector: 'app-outsourced-list',
  templateUrl: './outsourced-list.component.html',
  styleUrls: ['./outsourced-list.component.css']
})
export class OutsourcedListComponent implements OnInit {

  constructor(
    public rest: ProdutionService,
    private modalService: NgbModal,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private sweetAlertService: SweetAlertService
  ) { }
  OutsourcedData: Array<Outsourced> = new Array<Outsourced>();

  Workingdata: Array<any> = new Array<any>();
  Workingselectdata: Array<Outsourced> = new Array<Outsourced>();
  WorkingSearchtxt1: string = "";
  WorkingSearchtxt2: string = "";

  Paintingdata: Array<any> = new Array<any>();
  Paintingselectdata: Array<Outsourced> = new Array<Outsourced>();
  PaintingSearchtxt1: string = "";
  PaintingSearchtxt2: string = "";

  Packagedata: Array<any> = new Array<any>();
  Packageselectdata: Array<Outsourced> = new Array<Outsourced>();
  PackageSearchtxt1: string = "";
  PackageSearchtxt2: string = "";

  completedata: Array<Outsourced> = new Array<Outsourced>();
  CompleteType: string = "";
  CompleteTotalPrice: number = 0;

  SinglePrice: number = 0;

  hidden: boolean = false;
  ngOnInit(): void {
    this.GetData().subscribe();
  }
  public GetData() {
    this.spinnerService.show();
    const request: OutsourcedDataRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    return this.rest.apiOutsourcedData(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.OutsourcedData = res.OutsourcedData;
        this.Workingdatafilter();
        this.Paintingdatafilter();
        this.Packagedatafilter();
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }

  openmodal(type, modal, size) {
    this.CompleteType = type;
    switch (type) {
      case 'Working':
        this.completedata = [...this.Workingselectdata];
        break;
      case 'Painting':
        this.completedata = [...this.Paintingselectdata];
        break;
      case 'Package':
        this.completedata = [...this.Packageselectdata];
        break;

      default:
        break;
    }
    this.CalculateTotalPrice();

    this.modalService.open(modal, { centered: true, size: size });
  }
  Workingdatafilter() {
    this.Workingdata = this.OutsourcedData.filter(x =>
      (x.ProductionHeadCode.includes(this.WorkingSearchtxt1) ||
        x.ProductionCode.includes(this.WorkingSearchtxt1)) &&
      (x.ItemCode.includes(this.WorkingSearchtxt2) ||
        x.ItemName.includes(this.WorkingSearchtxt2) ||
        x.WorkingCompany.includes(this.WorkingSearchtxt2) ||
        x.CustomerCode.includes(this.WorkingSearchtxt2) ||
        x.CustomerName.includes(this.WorkingSearchtxt2)) &&
      x.WorkingStatus == 'N' &&
      x.WorkingUndoneQty > 0
    )
  }
  Paintingdatafilter() {
    this.Paintingdata = this.OutsourcedData.filter(x =>
      (x.ProductionHeadCode.includes(this.PaintingSearchtxt1) ||
        x.ProductionCode.includes(this.PaintingSearchtxt1)) &&
      (x.ItemCode.includes(this.PaintingSearchtxt2) ||
        x.ItemName.includes(this.PaintingSearchtxt2) ||
        x.PaintingCompany.includes(this.PaintingSearchtxt2) ||
        x.CustomerCode.includes(this.PaintingSearchtxt2) ||
        x.CustomerName.includes(this.PaintingSearchtxt2)) &&
      x.PaintingStatus == 'N' &&
      x.PaintingUndoneQty > 0
    )
  }
  Packagedatafilter() {
    this.Packagedata = this.OutsourcedData.filter(x =>
      (x.ProductionHeadCode.includes(this.PackageSearchtxt1) ||
        x.ProductionCode.includes(this.PackageSearchtxt1)) &&
      (x.ItemCode.includes(this.PackageSearchtxt2) ||
        x.ItemName.includes(this.PackageSearchtxt2) ||
        x.WorkingCompany.includes(this.PackageSearchtxt2) ||
        x.PaintingCompany.includes(this.PackageSearchtxt2) ||
        x.PackageCompany.includes(this.PackageSearchtxt2) ||
        x.CustomerCode.includes(this.PackageSearchtxt2) ||
        x.CustomerName.includes(this.PackageSearchtxt2)) &&
      x.PackageStatus == 'N' &&
      x.PackageUndoneQty > 0
    )
  }
  onSelect({ selected }) {
    //全選時selected會異常,所以自己寫
    /* this.selectdata.splice(0, this.selectdata.length);
    this.selectdata.push(...selected); */

  }

  updateValue(event, cell, rowIndex) {
    this.completedata[rowIndex][cell] = event.target.value;
    this.completedata = [...this.completedata];
  }
  CalculateTotalPrice() {
    switch (this.CompleteType) {
      case "Working":
        this.CompleteTotalPrice = 0;
        this.completedata.forEach(element =>
          this.CompleteTotalPrice += element.WorkingPrice * element.WorkingTodoQty
        );
        break;
      case "Painting":
        this.completedata.forEach(element =>
          this.CompleteTotalPrice += element.PaintingPrice * element.PaintingTodoQty
        );
        break;
      case "Package":
        this.completedata.forEach(element =>
          this.CompleteTotalPrice += element.PackagePrice * element.PackageTodoQty
        );
        break;
      default:
        break;
    }
  }
  UpdateCompleteDate(event) {
    switch (this.CompleteType) {
      case "Working":
        this.completedata.forEach(element =>
          element.WorkingFinishData = event.target.value
        );
        break;
      case "Painting":
        this.completedata.forEach(element =>
          element.PaintingFinishData = event.target.value
        );
        break;
      case "Package":
        this.completedata.forEach(element =>
          element.PackageFinishData = event.target.value
        );
        break;
      default:
        break;
    }

  }
  UpdateCompleteUnitPrice(event) {
    switch (this.CompleteType) {
      case "Working":
        this.completedata.forEach(element =>
          element.WorkingPrice = event.target.value
        );
        break;
      case "Painting":
        this.completedata.forEach(element =>
          element.PaintingPrice = event.target.value
        );
        break;
      case "Package":
        this.completedata.forEach(element =>
          element.PackagePrice = event.target.value
        );
        break;
      default:
        break;
    }
  }
  Complete() {
    this.spinnerService.show();
    const request: BatchSFCForOutsourcedReqeust = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      OutsourcedType: this.CompleteType,
      OutsourcedData: this.completedata
    }
    this.rest.apiBatchSFCForOutsourced(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.spinnerService.hide();
        this.rest.successMessage('成功');
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      switchMap(() => {
        return this.GetData()
      })
    ).subscribe();
  }
}
