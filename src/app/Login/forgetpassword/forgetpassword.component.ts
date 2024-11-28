import { Component, Inject, OnInit, Input } from '@angular/core';
import { LoginService } from 'src/app/Service/login.service'
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css'],
  providers: [LoginService]
})
export class ForgetpasswordComponent implements OnInit {
  @Input() UserId: string;

  constructor(@Inject(DOCUMENT) private document, private rest: LoginService) {}

  ngOnInit() {

  }

  doForgetPassword() {
    this.rest.API_ForgetPassword(this.UserId).then(
      (sucess) => {
        switch (sucess) {
          case "OK":
            this.document.getElementById('status').setAttribute('style', 'color:yellow;visibility:visible;');
            this.document.getElementById('status').innerHTML = "已寄出密碼至您的信箱";
            break;
          case "Fail":
            this.document.getElementById('status').setAttribute('style', 'color:red;visibility:visible;');
            this.document.getElementById('status').innerHTML = "您的帳號有誤";
            break;
          case "":
            this.document.getElementById('status').setAttribute('style', 'color:red;visibility:visible;');
            this.document.getElementById('status').innerHTML = "無此帳號";
            break;
          default:
            break;
        }
      }
      ,
      (fail) => {
        this.document.getElementById('status').setAttribute('style', 'color:red;visibility:visible;');
        this.document.getElementById('status').innerHTML = "您的帳號有誤或者無此帳號";
      }
    ).catch(
      (error: any) => {
        this.document.getElementById('status').setAttribute('style', 'color:red;visibility:visible;');
        this.document.getElementById('status').innerHTML = "密碼更換失敗，請聯絡管理員";
      }
    );
  }
}
