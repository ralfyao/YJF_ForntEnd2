import { Component, Inject, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Service/login.service'
import { DOCUMENT } from "@angular/common";
import { SessionStorageService, SessionStorage } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';

@Component({
  selector: 'app-modifypassword',
  templateUrl: './modifypassword.component.html',
  styleUrls: ['./modifypassword.component.css'],
  providers: [LoginService]
})
export class ModifypasswordComponent implements OnInit {
  @Input() UserId: string;
  @Input() UserPassword: string;
  @Input() UserNewPassword: string;
  @Input() UserNewPasswordConfirm: string;
  private changePWDFail: boolean = false;
  constructor(
    @Inject(DOCUMENT) private document,
    private router: Router,
    private rest: LoginService,
    private session: SessionStorageService
  ) {}

  ngOnInit() {
    if (this.session.retrieve(LoginSessionEnum.UserAccount) != null && String(this.session.retrieve(LoginSessionEnum.UserAccount)).length != 0) {
      this.UserId = this.session.retrieve(LoginSessionEnum.UserAccount);
    }
  }

  viewPassword(setView: boolean) {
    if (setView) {
      this.document.getElementById('oldpwd').setAttribute('type', 'text');
      this.document.getElementById('newpwd').setAttribute('type', 'text');
      this.document.getElementById('newpwdagain').setAttribute('type', 'text');
    } else {
      this.document.getElementById('oldpwd').setAttribute('type', 'password');
      this.document.getElementById('newpwd').setAttribute('type', 'password');
      this.document.getElementById('newpwdagain').setAttribute('type', 'password');
    }
  }

  doModifyPassword() {
    if (this.UserNewPasswordConfirm !== this.UserNewPassword) {
      this.document.getElementById('systemmessage').innerHTML = "新密碼二次輸入內不同，請確認";
      return;
    }
    this.rest.API_ModifyPassword(this.UserId, this.UserPassword, this.UserNewPassword).then(
      (sucess) => {
        switch (sucess) {
          case "OK":
            this.document.getElementById('systemmessage').innerHTML = "密碼已變更，將跳轉至登入";
            this.changePWDFail = false;
            break;
          default:
            this.changePWDFail = false;
            break;
        }
      }
      ,
      (fail) => {
        switch (fail) {
          case "Fail":
            this.document.getElementById('systemmessage').innerHTML = "密碼變更失敗，請聯絡管理員";
            this.changePWDFail = true;
            break;
          default:
            this.changePWDFail = true;
            break;
        }
      }).catch(
        (error) => {

        }
      );
  }

  Return() {
    if (!this.changePWDFail) {
      this.router.navigate(['login']);
    }
    else {

    }

  }
}
