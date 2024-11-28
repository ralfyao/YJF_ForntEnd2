import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'ngx-webstorage';
import { ProdutionService } from '../Service/ProdutionService';
import { FormServiceService } from '../Service/formService.service';
import { SweetAlertService } from '../Service/sweet-alert.service';
import { LoginSessionEnum } from '../Enum/session-enum.enum';
import { MoldRepairFormInquireRequest } from 'src/bin/moldRepairFormInquireRequest';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';
import { MoldRepairFormInquireResponseRepairList } from 'src/bin/moldRepairFormInquireResponseRepairList';

@Component({
  selector: 'app-modulMaintainInquire',
  templateUrl: './modulMaintainInquire.component.html',
  styleUrls: ['./modulMaintainInquire.component.css']
})
export class ModulMaintainInquireComponent implements OnInit {
  account: string;
  moldRepairFormInquireRequest: MoldRepairFormInquireRequest;
  formSelected: Array<MoldRepairFormInquireResponseRepairList> = [];
  constructor(
    private spinnerService: NgxSpinnerService,
    private session: SessionStorageService,
    private production: ProdutionService,
    public fS: FormServiceService,
    private modalService: NgbModal,
    private fB: FormBuilder
  ) { }
  noChange = { emitEvent: false, onlySelf: true };
  form: FormGroup = new FormGroup({
    ID: new FormControl(''),
    moldId: new FormControl(''),
    formStatus: new FormArray([]),
    moldType: new FormControl('')
  });
  statusList: Array<{
    value: string,
    text: string
  }> = [
      {
        value: 'statusAll',
        text: '全部'
      },
      {
        value: 'appling',
        text: '申請中'
      },
      {
        value: 'done',
        text: '完成'
      }

    ];
  moldTypeList: Array<{
    name: string,
    value: string
  }> = [
      {
        name: '鐵斗',
        value: '1'
      },
      {
        name: '木模',
        value: '2'
      },
      {
        name: '全部',
        value: ''
      }
    ]

  noDataMessages = {
    emptyMessage: `
    <div>
      查無資料
    </div>
  `
  };
  responseDatas: Array<MoldRepairFormInquireResponseRepairList>;

  ngOnInit() {
    this.account = this.session.retrieve(LoginSessionEnum.UserAccount);
    this.moldRepairFormInquireRequest = {
      Account: this.session.retrieve(LoginSessionEnum.UserAccount),
      formStatus: '',
    }
    this.statusList.forEach(() => {
      const control = this.fB.control(true);
      (this.form.get('formStatus') as FormArray).push(control);
    });
    const formStatusControls = this.form.get('formStatus') as FormArray;
    formStatusControls.at(0).valueChanges.pipe(
      tap(res => {
        formStatusControls.at(1).setValue(res, this.noChange);
        formStatusControls.at(2).setValue(res, this.noChange);
      })
    ).subscribe();
    formStatusControls.valueChanges.pipe(
      tap(res => {
        const restItem = res.filter((i, idx: number) => idx != 0);
        res[0] = restItem.every((i: boolean) => i == true);
        formStatusControls.setValue(res, this.noChange);
      })
    ).subscribe();
    this.form.get('moldType').valueChanges.subscribe((res) => { console.log(res) })
    this.getData();
    this.formSelected = [];
  }
  /**
   *設定request
   *
   * @memberof ModulMaintainInquireComponent
   */
  setRequest() {
    const keys = Object.keys(this.form.controls);
    keys.forEach((i) => {
      if (i == 'formStatus') {
        if (this.form.get(i).value[0] == true) {
          this.moldRepairFormInquireRequest[i] = '';
        } else {
          if (this.form.get(i).value[1]) this.moldRepairFormInquireRequest[i] = '0';
          else this.moldRepairFormInquireRequest[i] = '1'
        }
        return
      }
      this.moldRepairFormInquireRequest[i] = this.form.get(i).value;
    });
  }

  requestToFormValue() {
    const keys = Object.keys(this.form.controls);
    keys.forEach((i) => {
      if (i == 'formStatus') {
        console.log(this.moldRepairFormInquireRequest[i])
        if (this.moldRepairFormInquireRequest[i] == '') {
          this.form.get(i).setValue([true, true, true], this.noChange)
        } else {
          if (this.moldRepairFormInquireRequest[i] == '0') {
            this.form.get(i).setValue([false, true, false], this.noChange)
          } else {
            this.form.get(i).setValue([false, false, true], this.noChange)
          }
        }
        return
      }
      if (!this.moldRepairFormInquireRequest[i]) this.moldRepairFormInquireRequest[i] = '';
      this.form.get(i).setValue(this.moldRepairFormInquireRequest[i], this.noChange)
    })
  }

  openmodal(modal: any) {
    this.requestToFormValue();
    this.modalService.open(modal, { size: 'lg' });
  }

  onSearch() {
    this.setRequest();
    this.getData();
    this.modalService.dismissAll();
  }

  onClear() {
    this.form.reset();
    this.form.get('formStatus').setValue([false, false, false], this.noChange);
    this.form.get('moldType').setValue('', this.noChange);
  }

  getData() {
    this.spinnerService.show();
    this.production.apiMoldRepairFormInquire(this.moldRepairFormInquireRequest).pipe(
      tap(res => {
        this.responseDatas = res.repairList.map((i) => {
          return {
            ...i,
            Status: i.Status == '0' ? '申請中' : '完成',
            PatFlasType: i.PatFlasType == '1' ? '鐵斗' : i.PatFlasType == '2' ? '木模' : ''
          }
        });
      })
    ).subscribe().add(() => { this.spinnerService.hide(); })
  }

  get statusListArray() {
    return (this.form.get('formStatus') as FormArray).controls
  }

  printSeletedForm() {
    console.log(this.formSelected)
  }
}
