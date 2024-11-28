import { Component, Inject, OnInit, Input, Type } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Service/login.service'
import { PermissionService } from 'src/app/Service/permission.service'
import { DOCUMENT } from "@angular/common";
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum, QuotationPageEnum } from 'src/app/Enum/session-enum.enum';
import { SinglePermissionPerson } from 'src/app/Model/vo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, of } from 'rxjs';
import { IdentifyFaceResult, PersonGroupPersonList, Persons } from 'src/app/Model/azure-face-idservice';
import { FaceIDServiceService } from 'src/app/Service/face-idservice.service';
import { WebcamImage } from 'ngx-webcam';
import { ProdutionService } from 'src/app/Service/ProdutionService';
import { POstatus, SchedulingTable } from 'src/app/Model/production';
import { TakeScheduleResultRequest } from 'src/bin/takeScheduleResultRequest';
import { catchError, tap } from 'rxjs/operators';
import { POStatusListRequest } from 'src/bin/pOStatusListRequest';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  public UserId: string = "";
  public UserPassword: string = "";
  loadingtemplate: string = '<img src="assets/images/Loading.gif">';
  alertshow: boolean = false;
  form: FormGroup;
  altertMsg = '您的帳號或密碼有誤或帳號停用。';
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  showWebcam = true;
  deviceId: string;
  Persons: Persons = new Persons;
  PersonIDList: Array<PersonGroupPersonList> = new Array<PersonGroupPersonList>();
  CurrentPersonID: string = '';
  IdentifyFaceResult: IdentifyFaceResult[];
  webcamImage: WebcamImage;
  ManuelLogin: boolean = false;
  ScheduleResult: Array<SchedulingTable> = new Array<SchedulingTable>();
  POstatusList: Array<POstatus> = new Array<POstatus>();


  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    private rest: LoginService,
    private restPro: ProdutionService,
    private prm: PermissionService,
    private spinnerService: NgxSpinnerService,
    private sessionSt: SessionStorageService,
    private formBuilder: FormBuilder,
    private FaceService: FaceIDServiceService
  ) {

  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      UserId: [this.UserId, <any>Validators.required],
      UserPassword: [this.UserPassword, <any>Validators.required]
    });
    this.js();
  }

  js() {
    this.document.getElementById('alertstate').setAttribute('style', 'display:none;visibility:hidden;');
  }

  dologin(ev) {
    if (ev.key == 'Enter' || ev == 'Enter') {
      this.spinnerService.show();
      this.ManuelLogin = true;
      this.rest.API_DoLogin(this.UserId.toLocaleLowerCase(), this.UserPassword).then((sucess) => {
        this.sessionSt.store(LoginSessionEnum.SupplierID, sucess['SupplierID']);
        this.sessionSt.store(LoginSessionEnum.EmployeeID, sucess['EmployeeID']);
        this.sessionSt.store(LoginSessionEnum.UserAccount, this.UserId.toLocaleLowerCase());
        this.sessionSt.store(LoginSessionEnum.Name, sucess['UserName']);
        this.sessionSt.store(LoginSessionEnum.IsFirstLogin, sucess['IsFirstLogin']);
        this.sessionSt.store(LoginSessionEnum.AccountIdentity, sucess['AccountIdentity']);
        this.sessionSt.store(LoginSessionEnum.Status, sucess['Status']);
        this.sessionSt.store(LoginSessionEnum.YJFCode, sucess['YJFCode']);
        this.sessionSt.store("MenuList", sucess['MenuList']);
        this.sessionSt.store("PermissionPage", sucess['PermissionPage']);


        if (this.sessionSt.retrieve(LoginSessionEnum.IsFirstLogin) === "1") {
          this.spinnerService.hide();
          this.router.navigate(['modify_password']);
        } else {
          this.spinnerService.hide();
          this.getPermission();
        }
        if (sucess['AccountIdentity'] == "1") {
          this.Scheduling();
          this.POStatusListUpdate();
        }

      }, (fail) => {
        this.sessionSt.clear();
        this.ManuelLogin = false;
        this.alertshow = true;
        this.UserPassword = "";
        this.spinnerService.hide();
        this.altertMsg = '您的帳號或密碼有誤或帳號停用。';
        this.document.getElementById('alertstate').setAttribute('style', 'display:block;visibility:visible;');
      });
    } else if (ev == undefined) {
      this.spinnerService.show();
      this.rest.API_DoLogin(this.UserId.toLocaleLowerCase(), this.UserPassword).then((sucess) => {
        this.sessionSt.store(LoginSessionEnum.UserAccount, this.UserId.toLocaleLowerCase());
        this.sessionSt.store(LoginSessionEnum.EmployeeID, sucess['EmployeeID']);
        this.sessionSt.store(LoginSessionEnum.SupplierID, sucess['SupplierID']);
        this.sessionSt.store(LoginSessionEnum.Name, sucess['UserName']);
        this.sessionSt.store(LoginSessionEnum.IsFirstLogin, sucess['IsFirstLogin']);
        this.sessionSt.store(LoginSessionEnum.AccountIdentity, sucess['AccountIdentity']);
        this.sessionSt.store(LoginSessionEnum.Status, sucess['Status']);
        this.sessionSt.store(LoginSessionEnum.YJFCode, sucess['YJFCode']);

        if (this.sessionSt.retrieve(LoginSessionEnum.IsFirstLogin) === "1") {
          this.router.navigate(['modify_password']);
          this.spinnerService.hide();
        } else {
          this.spinnerService.hide();
          this.getPermission();
        }
        if (sucess['AccountIdentity'] == "1") {
          this.Scheduling();
          this.POStatusListUpdate();
        }
      }, (fail) => {
        this.sessionSt.clear();
        this.alertshow = true;
        this.ManuelLogin = false;
        this.UserPassword = "";
        this.spinnerService.hide();
        this.altertMsg = '您的帳號或密碼有誤或帳號停用。';
        this.document.getElementById('alertstate').setAttribute('style', 'display:block;visibility:visible;');

      });
    } else {
      return;
    }
  }

  getPermission() {
    this.prm.API_Query_PermissionPersonSource(this.UserId.toLocaleLowerCase()).then((sucess) => {
      let PermissionPersonSource: Array<SinglePermissionPerson> = sucess['PermissionPersonSourceReps'];
      this.sessionSt.store(LoginSessionEnum.Permission, PermissionPersonSource);
      if (this.sessionSt.retrieve(LoginSessionEnum.Status) !== "1") {
        this.altertMsg = '您的帳號或密碼有誤或帳號停用。';
        this.document.getElementById('alertstate').setAttribute('style', 'display:block;visibility:visible;');
        this.spinnerService.hide();
        return;
      }
      this.router.navigate(['login_success']);
      this.spinnerService.hide();
    }, (fail) => {
      this.sessionSt.clear();
      this.alertshow = true;
      this.UserPassword = "";
      this.spinnerService.hide();
      this.altertMsg = '您的帳號或密碼有誤或帳號停用。';
      this.document.getElementById('alertstate').setAttribute('style', 'display:block;visibility:visible;');
      this.altertMsg = '您的帳號或密碼有誤或帳號停用。';
    });
  }

  Scheduling() {
    const request: TakeScheduleResultRequest = {
      Account: this.sessionSt.retrieve(LoginSessionEnum.UserAccount)
    }
    this.restPro.apiTakeScheduleResult(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null) {
          throw (res.ErrorMsg)
        }
        this.ScheduleResult = res.SchedulingList;
        this.sessionSt.store(QuotationPageEnum.ScheduleResult, this.ScheduleResult);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe()
  }

  POStatusListUpdate() {
    this.spinnerService.show();
    const request: POStatusListRequest = {
      Account: this.sessionSt.retrieve(LoginSessionEnum.UserAccount)
    };
    this.restPro.apiPOStatusList(request).pipe(
      tap(res => {
        if (res.WorkStatus != 'OK' && res.WorkStatus != null && res.WorkStatus != 'Success') {
          throw (res.ErrorMsg)
        }
        this.POstatusList = res.POstatusList;
        this.sessionSt.store(QuotationPageEnum.POstatusList, this.POstatusList);
        this.spinnerService.hide();
      }),
      catchError((res) => {
        this.rest.errorWithErrorMsg(res);
        this.spinnerService.hide();
        return of()
      })
    ).subscribe();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  triggerSnapshot() {
    this.ManuelLogin = false;
    this.trigger.next();
  }

  handleImage(webcamImage: WebcamImage) {
    this.spinnerService.show();
    if (this.deviceId == null && this.ManuelLogin == true) {
      this.spinnerService.hide();
      return;
    }
    this.webcamImage = webcamImage;

    //取得臉部辨識碼
    this.FaceService.GetFaceID(webcamImage).then((faceid) => {

      this.Persons = Object.assign(new Persons, faceid);
      //如果臉部辨識成功的話
      if (Object.assign(new Array, faceid).length > 0) {
        //送出比對看這張臉是誰
        this.FaceService.IdentifyFace(this.Persons[0].faceId, this.CurrentPersonID).then((data) => {
          this.IdentifyFaceResult = Object.assign(new Array<IdentifyFaceResult>(), data);
          this.rest.API_FaceIDLogin(this.IdentifyFaceResult[0]).then((sucess) => {
            this.sessionSt.store(LoginSessionEnum.UserAccount, this.UserId.toLocaleLowerCase());
            this.sessionSt.store(LoginSessionEnum.EmployeeID, sucess['EmployeeID']);
            this.sessionSt.store(LoginSessionEnum.SupplierID, sucess['SupplierID']);
            this.sessionSt.store(LoginSessionEnum.Name, sucess['UserName']);
            this.sessionSt.store(LoginSessionEnum.IsFirstLogin, sucess['IsFirstLogin']);
            this.sessionSt.store(LoginSessionEnum.AccountIdentity, sucess['AccountIdentity']);
            this.sessionSt.store(LoginSessionEnum.Status, sucess['Status']);
            this.sessionSt.store(LoginSessionEnum.YJFCode, sucess['YJFCode']);
            this.UserId = sucess['UserId'];
            this.sessionSt.store(LoginSessionEnum.UserAccount, this.UserId.toLocaleLowerCase());
            if (sucess['AccountIdentity'] == "1") {
              this.Scheduling();
              this.POStatusListUpdate();
            }
            if (this.sessionSt.retrieve(LoginSessionEnum.IsFirstLogin) === "1") {
              this.router.navigate(['modify_password']);
              this.spinnerService.hide();
            } else {
              this.spinnerService.hide();
              this.getPermission();
            }
            //拿出比對結果，如果結果大於九成機率,且等於登入帳號者
            if (this.IdentifyFaceResult[0].candidates[0].personId == this.CurrentPersonID && this.IdentifyFaceResult[0].candidates[0].confidence > 0.75) {
              //送出檢驗結果，並將最新的一張圖片，送入學習庫
              this.FaceService.AddFace(this.CurrentPersonID, webcamImage).then((af) => {
                //啟動伺服器自動學習最新照片(背景學習，需要一點時間)
                this.FaceService.TranGroup();
                //取得伺服器學習結果
                // this.FaceService.GetTranStatus().then((Result)=>{

                // })
              });
            }
            this.spinnerService.hide();
          }, (fail) => {
            this.sessionSt.clear();
            this.alertshow = true;
            this.UserPassword = "";
            this.spinnerService.hide();
            this.altertMsg = '臉部辨識失敗';
            this.document.getElementById('alertstate').setAttribute('style', 'display:block;visibility:visible;');
          });
        });
      } else {
        this.sessionSt.clear();
        this.alertshow = true;
        this.UserPassword = "";
        this.altertMsg = '臉部辨識失敗';
        this.spinnerService.hide();
        this.document.getElementById('alertstate').setAttribute('style', 'display:block;visibility:visible;');

      }
    })
  }

  alertclose() {
    this.document.getElementById('alertstate').setAttribute('style', 'display:none;visibility:hidden;');
  }

}
