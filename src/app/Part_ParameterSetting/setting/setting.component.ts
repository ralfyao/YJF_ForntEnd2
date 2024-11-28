import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ParameterSettingService } from 'src/app/Service/parameter-setting.service';
import { DynamicComponentHostDirective } from '../../CommomModule/compomenthost.directive';
import { MeltCastSettingComponent } from '../melt-cast-setting/melt-cast-setting.component';
import { RFQSettingComponent } from '../rfqsetting/rfqsetting.component';
import { ShutdownsettingComponent } from '../shutdownsetting/shutdownsetting.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
  providers: [ParameterSettingService]
})
export class SettingComponent implements OnInit {
  /** 主選單動態區塊元件產生元件
   * @type {DynamicComponentHostDirective}
   */
  @ViewChild(DynamicComponentHostDirective, { static: true }) dynamicComponentLoader: DynamicComponentHostDirective;
  constructor(
    private spinnerService: NgxSpinnerService,
    private componenFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.setDynamicComponent('MeltCast');
  }

  loadSetting() {

  }

  /**設定動態元件控制埠的元件內容
   * @param {string} functionstr 動態元件功能名稱
   * @param {*} obj 將要傳入動態元件的資料
   */
  setDynamicComponent(functionstr: string) {
    this.spinnerService.show();
    let targetComponent = null;
    switch (functionstr) {
      case 'MeltCast':
        targetComponent = MeltCastSettingComponent;
        break;
      case 'RFQSetting':
        targetComponent = RFQSettingComponent;
        break;
      case 'SDSetting':
        targetComponent = ShutdownsettingComponent;
        break;
      default:
        targetComponent = null;
        break;
    }
    const componentFactory = this.componenFactoryResolver.resolveComponentFactory(targetComponent);
    const viewContainerRef = this.dynamicComponentLoader.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);
    this.spinnerService.hide();

  }
}
