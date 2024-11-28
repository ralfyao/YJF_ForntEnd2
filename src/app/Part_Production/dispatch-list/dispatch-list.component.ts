import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode'
import { GetPrepareMoldListRequest } from 'src/bin/getPrepareMoldListRequest';
import { GetPrepareMoldListResponsePrepareList } from 'src/bin/getPrepareMoldListResponsePrepareList';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
@Component({
  selector: 'app-dispatch-list',
  templateUrl: './dispatch-list.component.html',
  styleUrls: ['./dispatch-list.component.css']
})
export class DispatchListComponent implements OnInit {

  constructor(
    public rest: ProdutionService,
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private sweetAlertService: SweetAlertService,
    public changeDetectorRef: ChangeDetectorRef
  ) { }
  Today: string = new Date().toLocaleDateString('zh-CN');

  WarehouseList: Array<string> = [];
  LineList: Array<string> = [];


  SelectLine: string = "全部";
  StartDate: string = "";
  EndDate: string = "";

  SelectWarehouse: string = "全部";

  AllPrepareList: Array<GetPrepareMoldListResponsePrepareList> = [];
  PrepareMoldList: Array<any> = [];
  SelectedPrepare: Array<any> = [];
  PrintPrepare: Array<any> = [];

  AllReturnList: Array<any> = [];
  ReturnMoldList: Array<any> = [];
  SelectedReturn: Array<any> = [];
  PrintReturn: Array<any> = [];

  PrintPage: number = 0;

  ngOnInit(): void {
    this.GetData();
  }
  GetData() {
    this.spinnerService.show();
    const request: GetPrepareMoldListRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount)
    }
    this.rest.apiGetPrepareMoldList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.AllPrepareList = res.PrepareList;
        this.AllReturnList = res.RetuenList;
        this.LineList = Array.from(new Set(this.AllPrepareList.map(x => x.MoldingLineName)));
        this.WarehouseList = Array.from(new Set(this.AllReturnList.map(x => x.WarehouseName)));
        this.PrepareFilter();
        this.ReturnFilter();
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }


  async SetQrCode() {
    this.spinnerService.show();
    arrayremove(this.SelectedPrepare);
    this.PrepareMoldList.filter(x => x.PrintMold == true).forEach(element => {
      let MoldItem: any = new Object();
      MoldItem.CustomerName = element.CustomerName;
      MoldItem.ItemCode = element.ItemCode;
      MoldItem.PartDesc = element.PartDesc;
      MoldItem.Type = '外模';
      MoldItem.Remark = element.OuterPatternRemark;
      MoldItem.Qty = element.MoldQty;
      MoldItem.StartLocation = element.MoldHouse;
      MoldItem.EndLocation = element.MoldingLineName;
      MoldItem.PrintItemCode = element.MoldItemCode;
      this.SelectedPrepare.push(MoldItem);
    });
    this.PrepareMoldList.filter(x => x.PrintCore == true).forEach(element => {
      let CoreItem: any = new Object();
      CoreItem.ItemCode = element.ItemCode;
      CoreItem.PartDesc = element.PartDesc;
      CoreItem.Type = '砂心';
      CoreItem.Remark = element.SandCoreRemark;
      CoreItem.Qty = element.CoreQty;
      CoreItem.StartLocation = element.CoreHouse;
      CoreItem.EndLocation = element.CoreLineName;
      CoreItem.PrintItemCode = element.CoreItemCode;
      this.SelectedPrepare.push(CoreItem);
    });
    for (let index = 0; index < this.SelectedPrepare.length; index++) {
      await QRCode.toDataURL(this.SelectedPrepare[index]['PrintItemCode']).then(url => { this.SelectedPrepare[index]['ImgUrl'] = url })
    }

    arrayremove(this.SelectedReturn);
    this.ReturnMoldList.filter(x => x.PrintMold == true).forEach(element => {
      let MoldItem: any = new Object();
      MoldItem.ItemCode = element.ItemCode;
      MoldItem.PartDesc = element.ItemName;
      MoldItem.Type = element.MoldType;
      MoldItem.Remark = element.Remark;
      MoldItem.Qty = element.MoldQty;
      MoldItem.StartLocation = element.WarehouseName;
      MoldItem.EndLocation = element.MainWarehouseName + '-' + element.MainLocation;
      MoldItem.PrintItemCode = element.MoldItemCode;
      this.SelectedReturn.push(MoldItem);
    });
    for (let index = 0; index < this.SelectedReturn.length; index++) {
      await QRCode.toDataURL(this.SelectedReturn[index]['PrintItemCode']).then(url => { this.SelectedReturn[index]['ImgUrl'] = url })
    }

    await this.PrintPDF();
    this.spinnerService.hide();
  }
  async PrintPDF() {
    let PDF = new jsPDF('l', 'mm', 'a4'); // A4 size page of PDF
    let DATA = document.getElementById('printpdf');
    DATA.style.display = "block";
    this.PrintPage = 1
    let Count = 0;
    arrayremove(this.PrintPrepare);
    arrayremove(this.PrintReturn);
    try {
      for (let i = 0; i < this.SelectedPrepare.length; i++) {
        this.PrintPrepare.push(this.SelectedPrepare[i]);
        Count++;
        if (Count == 5) {
          this.changeDetectorRef.detectChanges()//更新畫面
          if (this.PrintPage != 1) {
            PDF.addPage();
          }
          await html2canvas(DATA).then(canvas => {
            let fileWidth = 287;
            let fileHeight = canvas.height * fileWidth / canvas.width;
            const FILEURI = canvas.toDataURL('image/png')
            PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)
            Count = 0;
            arrayremove(this.PrintPrepare)
            this.PrintPage++;
          }).catch(function (error) {
            DATA.style.display = "none";
            this.spinnerService.hide();
            this.sweetAlertService.alertFail({
              text: '派車單匯出失敗!!',
            });
            return;
          });
        }
      }
      for (let i = 0; i < this.SelectedReturn.length; i++) {
        this.PrintReturn.push(this.SelectedReturn[i]);
        Count++;
        if (Count == 5) {
          this.changeDetectorRef.detectChanges()//更新畫面
          if (this.PrintPage != 1) {
            PDF.addPage();
          }
          await html2canvas(DATA).then(canvas => {
            let fileWidth = 287;
            let fileHeight = canvas.height * fileWidth / canvas.width;
            const FILEURI = canvas.toDataURL('image/png')
            PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)
            Count = 0;
            arrayremove(this.PrintPrepare);
            arrayremove(this.PrintReturn);
            this.PrintPage++;
          }).catch(function (error) {
            DATA.style.display = "none";
            this.spinnerService.hide();
            this.sweetAlertService.alertFail({
              text: '派車單匯出失敗!!',
            });
            return;
          });
        }
      }
      if (this.PrintPrepare.length > 0 || this.PrintReturn.length > 0) {
        if (this.PrintPage != 1) {
          PDF.addPage();
        }
        this.changeDetectorRef.detectChanges()//更新畫面
        await html2canvas(DATA).then(canvas => {
          let fileWidth = 287;
          let fileHeight = canvas.height * fileWidth / canvas.width;
          const FILEURI = canvas.toDataURL('image/png')
          PDF.addImage(FILEURI, 'PNG', 5, 5, fileWidth, fileHeight)
          Count = 0;
          arrayremove(this.PrintPrepare);
          arrayremove(this.PrintReturn);
          this.PrintPage++;
        }).catch(function (error) {
          DATA.style.display = "none";
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: '派車單匯出失敗!!',
          });
          return;
        });
      }
      PDF.save('派車單.pdf')
    }
    catch (error) {
      DATA.style.display = "none";
      this.spinnerService.hide();
      this.sweetAlertService.alertFail({
        text: '派車單匯出失敗!!'
      });
      console.log("Error Message:" + error);
      return;
    }




  }
  PrepareFilter() {
    this.PrepareMoldList = this.AllPrepareList.filter(x => x.MoldingLineName == this.SelectLine || this.SelectLine == '全部')
  }
  ReturnFilter() {
    this.ReturnMoldList = this.AllReturnList.filter(x => x.WarehouseName == this.SelectWarehouse || this.SelectWarehouse == '全部')
  }

  //yyyymmdd=>yyyy-mm-dd
  DateStringFormat(date: string) {
    if (date.length < 8)
      return date

    return date.substring(0, 4) + '-' + date.substring(4, 6) + '-' + date.substring(6, 8)
  }
}
function arrayremove(array) {
  let length = array.length;
  for (let index = 0; index < length; index++) {
    array.splice(0, 1);
  }
}
