import { Component, OnInit } from '@angular/core';
import { OnePageService } from 'src/app/Service/onepage.service';
import { SweetAlertService  } from 'src/app/Service/sweet-alert.service'

@Component({
  templateUrl: './mold-access-record.component.html',
  styleUrls: ['./mold-access-record.component.css']
})
export class MoldAccessRecordComponent implements OnInit {

  constructor(
    public rest: OnePageService,
    private sweetAlertService: SweetAlertService
  ) { }


  Loading: boolean = false;
  ScannerEnable: boolean = false;
  availableDevices: MediaDeviceInfo[]=[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string='';

  UserCode: string = "";
  OrderDate: string = new Date().toLocaleDateString('en-CA');
  ChangeType: string = 'out';
  ItemCode: string = '';

  ngOnInit(): void {
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    if (devices.length>0 && devices.filter(x=>x.deviceId==this.deviceSelected).length==0) {
      this.deviceSelected=devices[0].deviceId;
      this.deviceCurrent=devices[0];
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
  onScanSuccess(result) {
      this.ItemCode = result;
      this.ScannerEnable = false;
  }
  SaveRecord(){
    this.rest.API_InsertMoldAccessRecord(this.UserCode, this.ItemCode, this.ChangeType).then(
      (data) => {
        if (data["WorkStatus"] == "Success") {
          this.Loading = true;
          this.sweetAlertService.alertSuccess({
            text:'成功'
          });

        } else if (data["WorkStatus"] == "Fail") {
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
        }
      }
    ).finally(() => { this.Loading = false; });
  }
}
