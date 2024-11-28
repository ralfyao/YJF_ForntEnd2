import { Component, OnInit } from '@angular/core';
import { OnePageService } from 'src/app/Service/onepage.service';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
@Component({
  selector: 'app-mold-stock-change',
  templateUrl: './mold-stock-change.component.html',
  styleUrls: ['./mold-stock-change.component.css']
})
export class MoldStockChangeComponent implements OnInit {

  constructor(
    public rest: OnePageService,
    private sweetAlertService: SweetAlertService
  ) { }

  Loading: boolean = false;
  Success: boolean = false;
  ScannerEnable: boolean = false;
  ScannerType: string = '';
  availableDevices: MediaDeviceInfo[] = [];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string = '';

  MoldWareHouseList: Array<any> = [];
  WorkWareHouseList: Array<any> = [];

  UserCode: string = "";
  OrderDate: string = new Date().toLocaleDateString('en-CA');
  ChangeType: string = 'out';
  WareHouse: string = '';
  Location: string = '';
  ItemCode: string = '';
  Quantity: number;



  ngOnInit(): void {
    this.GetData();
  }

  GetData() {
    this.Loading = true;
    this.rest.API_GetMoldChangeData('').then(
      (data) => {
        this.MoldWareHouseList = data["MoldWareHouseList"];
        this.WorkWareHouseList = data['WorkWareHouseList'];
      }
    ).finally(() => { this.Loading = false; });
  }

  ScannerClick(type) {
    this.ScannerType = type;
    this.ScannerEnable = true;
  }
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    if (devices.length > 0 && devices.filter(x => x.deviceId == this.deviceSelected).length == 0) {
      this.deviceSelected = devices[0].deviceId;
      this.deviceCurrent = devices[0];
    }
  }
  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }
  onScanSuccess(result: string) {
    this.ScannerEnable = false;
    this.Loading = true;
    if (this.ScannerType == 'WareHouse') {
      if (result.length > 0) {
        let infolist: Array<string> = result.split('_');
        if (this.MoldWareHouseList.filter(x => x.MC001.trim() == infolist[0]).length > 0) {
          this.WareHouse = infolist[0];
          if (infolist.length > 1) {
            this.Location = infolist[1];
          }
          this.Loading = false;
          return;
        }
      }
      this.WareHouse = '';
      this.sweetAlertService.alertFail({
        text: '倉庫代碼錯誤！'
      })
      this.Loading = false;
    } else if (this.ScannerType == 'ItemCode') {
      this.ItemCode = '';
      this.rest.API_ConfirmItemCode(result).then(
        (data) => {
          if (data["WorkStatus"] == "Success") {
            this.Quantity = data['Quantity'];
            if (data['IsTrue'] == true) {
              this.ItemCode = result;
            } else {
              this.sweetAlertService.alertFail({
                text: '品號錯誤！'
              })
            }
          } else {
            this.sweetAlertService.alertFail({
              text: data['ErrorMsg']
            })
          }
        }).finally(() => {
          this.Loading = false;
        })
    }

  }
  Save() {
    this.Loading = true;
    if (this.UserCode.length!=5) {
      this.Loading = false;
      this.sweetAlertService.alertFail({
        text: "請輸入完整工號!"
      });
      return;
    }else if(this.ItemCode==""){
      this.Loading = false;
      this.sweetAlertService.alertFail({
        text: "請掃描品號!"
      });
      return;
    }else if(this.WareHouse==""){
      this.Loading = false;
      this.sweetAlertService.alertFail({
        text: "請掃描倉庫!"
      });
      return;
    }
    if (this.ChangeType == 'out') {
      this.rest.API_InsertDeliveryOrder(this.UserCode, this.OrderDate.replace(/-/g, ""), this.ItemCode, this.Quantity, this.WareHouse).then(
        (data) => {
          if (data["WorkStatus"] == "Success") {
            this.Success = true;
            this.sweetAlertService.alertSuccess({
              text: '成功'
            });
            return;
          } else if (data["WorkStatus"] == "Fail") {
            this.sweetAlertService.alertFail({
              text: data["ErrorMsg"],
            });
          }
        }
      ).finally(() => { this.Loading = false; });
    } else if (this.ChangeType == 'in') {
      this.rest.API_InsertStorageOrder(this.UserCode, this.OrderDate.replace(/-/g, ""), this.ItemCode, this.Quantity, this.WareHouse, this.Location).then(
        (data) => {
          if (data["WorkStatus"] == "Success") {
            this.Success = true;
            this.sweetAlertService.alertSuccess({
              text: '成功'
            });
            return;
          } else if (data["WorkStatus"] == "Fail") {
            this.sweetAlertService.alertFail({
              text: data["ErrorMsg"],
            });
          }
        }
      ).finally(() => { this.Loading = false; });
    }


  }
  Refresh() {
    location.reload();
  }
}
