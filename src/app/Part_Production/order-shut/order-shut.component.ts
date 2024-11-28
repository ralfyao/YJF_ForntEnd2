import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderShutDownInfo, ShutDownListInfo } from 'src/app/Model/production'
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { GetShutDownListRequest } from 'src/bin/getShutDownListRequest';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UpdateShutDownDetailRequest } from 'src/bin/updateShutDownDetailRequest';
import { DeleteShutDownReqeust } from 'src/bin/deleteShutDownReqeust';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-order-shut',
  templateUrl: './order-shut.component.html',
  styleUrls: ['./order-shut.component.css']
})
export class OrderShutComponent implements OnInit {
  @ViewChild('mydatatable') mydatatable: DatatableComponent;
  constructor(
    private rest: ProdutionService,
    private modalService: NgbModal,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount);
  ShutDownDataTemp: Array<OrderShutDownInfo> = new Array<OrderShutDownInfo>();
  ShutDownData: Array<OrderShutDownInfo> = new Array<OrderShutDownInfo>();
  selectedItem: Array<OrderShutDownInfo> = new Array<OrderShutDownInfo>();
  ShutDownList: Array<ShutDownListInfo> = new Array<ShutDownListInfo>();
  PageModalData: OrderShutDownInfo = new OrderShutDownInfo();
  productionOrderSearch: string = '';
  shutDownNameSearch: string = '';
  otherReasonSearch: string = '';
  searchText:string='';
  orderErrStatusSearch: boolean = true;
  ngOnInit(): void {
    this.GetDate().subscribe();
  }

  GetDate(WorkOrder:string = '',SearchString='',ShutDownName='',OtherReason='',OrderStatus=undefined) {
    this.ShutDownData = [];
    this.spinnerService.show();
    const request: GetShutDownListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      SearchString:SearchString,
      WorkOrder:WorkOrder,
      ShutDownName:ShutDownName,
      OtherReason:OtherReason,
      OrderStatus:OrderStatus
    }
    return this.rest.apiGetShutDownList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ShutDownData = res.ShutDownList;
        this.ShutDownDataTemp = this.ShutDownData.map((i) => { return { ...i } });
        this.ShutDownList = res.ShutDownDetail;
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    )
  }

  PageEdit(modal) {
    if (!this.selectedItem[0]) {
      this.rest.errorWithErrorMsg('請選擇工單');
      return
    }
    this.PageModalData = { ...this.selectedItem[0] };
    this.openmodal(modal, '')
  }
  /**
   *上傳編輯資料
   *
   * @memberof OrderShutComponent
   */
  PageSave() {
    this.selectedItem = this.selectedItem.map((i, index) => {
      if (index == 0) {
        return {
          ...this.PageModalData
        }
      } else {
        return {
          ...this.PageModalData,
          ProductionOrder: i.ProductionOrder
        }
      }
    })

    this.spinnerService.show();
    this.selectedItem.forEach((i) => {
      const request: UpdateShutDownDetailRequest = {
        Account: this.UserAccount,
        updateShutDown: i
      }
      this.rest.apiUpdateShutDownDetail(request).pipe(
        tap(res => {
          if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
            throw (res.ErrorMsg)
          }
        }),
        catchError((res) => {
          this.rest.errorWithErrorMsg(res);
          this.spinnerService.hide();
          return of()
        }),
        tap(() => {
          this.rest.successMessage('儲存成功');
          this.spinnerService.hide();
        }),
        switchMap(() => {
          return this.GetDate()
        })
      ).subscribe()
    })

  }

  ShutDownDelete(ProductionOrder: string, ShutDownName: string, IsDelete: boolean) {
    this.spinnerService.show();
    const request: DeleteShutDownReqeust = {
      ProductionOrder: ProductionOrder,
      ShutDownName: ShutDownName,
      Account: this.UserAccount,
      IsDelete: IsDelete
    }
    this.rest.apiDeleteShutDown(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      }),
      tap(() => {
        this.rest.successMessage('變更成功');
        this.spinnerService.hide();
      }),
      switchMap(() => {
        return this.GetDate()
      })
    ).subscribe();
  }

  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }

  onSelect(selectedItem: { selected: Array<OrderShutDownInfo> }) {
    this.selectedItem = selectedItem.selected.map((i) => {
      return {
        ...i
      }
    });

  }


  onSearch() {
    this.GetDate(this.productionOrderSearch, this.searchText, this.shutDownNameSearch, this.otherReasonSearch, this.orderErrStatusSearch).subscribe();
    // this.mydatatable.selected = [];
    // this.selectedItem = [];
    // this.ShutDownData = this.ShutDownDataTemp.filter((i) => {
    //   return i.ProductionOrder.includes(this.productionOrderSearch)
    //     && i.ShutDownName == this.shutDownNameSearch
    //     && i.OrderErrStatus == this.orderErrStatusSearch
    // })
    this.modalService.dismissAll();
  }

  onClear() {
    this.productionOrderSearch = '';
    this.shutDownNameSearch = '';
    this.otherReasonSearch = '';
    this.orderErrStatusSearch = false;
    this.ShutDownData = this.ShutDownDataTemp.map((i) => i)
  }
}
