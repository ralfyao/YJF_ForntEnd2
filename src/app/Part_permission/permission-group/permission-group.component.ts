import { count } from 'rxjs/operators';
import { GroupList } from './../../Part_RFQ_Result/rfq-supplier-status/rfq-supplier-status.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { SweetAlertService } from 'src/app/Service/sweet-alert.service'
import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from 'src/app/Enum/session-enum.enum';
import { PermissionService } from 'src/app/Service/permission.service';
import { PermissionGroup, GroupPermission, RolePermission, GroupPerson, GroupRole, Account } from 'src/app/Model/PermissionData'
@Component({
  selector: 'app-permission-group',
  templateUrl: './permission-group.component.html',
  styleUrls: ['./permission-group.component.css']
})
export class PermissionGroupComponent implements OnInit {

  constructor(
    private rest: PermissionService,
    private modalService: NgbModal,
    private session: SessionStorageService,
    private spinnerService: NgxSpinnerService,
    private sweetAlertService: SweetAlertService
  ) { }


  UserAccount = this.session.retrieve(LoginSessionEnum.UserAccount)
  GroupData: Array<PermissionGroup> = new Array<PermissionGroup>();
  GroupPermissionData: Array<GroupPermission> = new Array<GroupPermission>();
  AccountData: Array<Account> = new Array<Account>();

  EditPermissionGroup: PermissionGroup = new PermissionGroup();
  EditGroupPerson: GroupPerson = new GroupPerson();
  EditGroupRole: GroupRole = new GroupRole();

  SelectGroup: PermissionGroup = new PermissionGroup();

  RolePermissionData: Array<RolePermission> = new Array<RolePermission>();

  PersonReturnType: string = "";

  ngOnInit(): void {
    this.GetData();
  }
  //獲取頁面資料
  GetData() {
    this.spinnerService.show();
    this.rest.API_PermissionData().then(
      (data) => {
        this.GroupData = data["GroupList"];
        this.AccountData = data["AccountList"];
        if (this.SelectGroup.SYS_Group_Id != 0) {
          this.SelectGroup = this.GroupData.filter(x => x.SYS_Group_Id == this.SelectGroup.SYS_Group_Id)[0];
        }
        if (this.EditPermissionGroup.SYS_Group_Id != 0) {
          this.EditPermissionGroup = this.GroupData.filter(x => x.SYS_Group_Id == this.EditPermissionGroup.SYS_Group_Id)[0];
        }
      }).finally(() => {
        this.spinnerService.hide();
      });

  }

  //#region 權限設定
  PermissionEdit(modal, GroupPermissionList) {
    this.GroupPermissionData = JSON.parse(JSON.stringify(GroupPermissionList))
    this.openmodal(modal, 'lg')
  }
  PermissionSave() {
    this.rest.API_GroupPermissionSave(this.UserAccount, this.GroupPermissionData).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '儲存成功'
          });
          this.GetData();
        }
      }).finally(() => {
        this.spinnerService.hide();
      });

  }
  //#endregion
  //#region 群組編輯
  GroupAdd(modal) {
    this.EditPermissionGroup = new PermissionGroup();
    this.openmodal(modal, '')
  }
  GroupEdit(modal, EditGroup) {
    if (EditGroup == null) {
      this.EditPermissionGroup = new PermissionGroup();
    } else {
      this.EditPermissionGroup = JSON.parse(JSON.stringify(EditGroup))
    }
    this.RolePermissionData = new Array<RolePermission>();
    this.openmodal(modal, 'lg')
  }

  GroupSave() {
    if (this.EditPermissionGroup.GroupName == "") {
      this.sweetAlertService.alertFail({
        text: "請輸入群組名稱",
      })
      return;
    } else if (this.EditPermissionGroup.ManagerName == "") {
      this.sweetAlertService.alertFail({
        text: "請選擇管理員",
      })
      return;
    }
    this.rest.API_GroupSave(this.UserAccount, this.EditPermissionGroup).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '儲存成功'
          });
          this.modalService.dismissAll();
          this.GetData();
        }
      }).finally(() => {
        this.spinnerService.hide();
      });
  }
  GroupDelete(GroupId) {
    this.spinnerService.show();
    this.rest.API_GroupDelete(this.UserAccount, GroupId).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.GetData();
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '刪除成功'
          });

        }
      }).finally(() => {
        this.spinnerService.hide();
      });
  }
  GroupRoleEdit(modal, EditRole) {

    if (EditRole == null) {
      this.EditGroupRole = new GroupRole();
      this.EditGroupRole.GroupId = this.EditPermissionGroup.SYS_Group_Id;
    } else {
      this.EditGroupRole = JSON.parse(JSON.stringify(EditRole))
    }

    this.openmodal(modal, 'sm')
  }
  GroupRoleSave() {
    this.rest.API_GroupRoleSave(this.UserAccount, this.EditGroupRole).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '儲存成功'
          });
          this.GetData();
        }
      }).finally(() => {
        this.spinnerService.hide();
      });

  }
  GroupRoleDelete(GroupRoleId) {
    this.spinnerService.show();
    this.rest.API_GroupRoleDelete(this.UserAccount, GroupRoleId).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.GetData();
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '刪除成功'
          });

        }
      }).finally(() => {
        this.spinnerService.hide();
      });
  }
  GroupPersonSave() {
    if (this.EditGroupPerson.EmployeeName == "") {
      this.sweetAlertService.alertFail({
        text: "未選擇人員",
      })
      return;
    } else if (this.EditGroupPerson.RoleId == 0) {
      this.sweetAlertService.alertFail({
        text: "未選擇角色",
      })
      return;
    }
    this.rest.API_GroupPersonSave(this.UserAccount, this.EditGroupPerson).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '儲存成功'
          });
          this.GetData();
        }
      }).finally(() => {
        this.spinnerService.hide();
        this.modalService.dismissAll();
      });
  }
  GroupPersonDelete(GroupPersonId) {
    this.spinnerService.show();
    this.rest.API_GroupPersonDelete(this.UserAccount, GroupPersonId).then(
      (data) => {
        if (data['WorkStatus'] == "Fail") {
          this.spinnerService.hide();
          this.sweetAlertService.alertFail({
            text: data["ErrorMsg"],
          });
          return;
        } else {
          this.GetData();
          this.spinnerService.hide();
          this.sweetAlertService.alertSuccess({
            text: '刪除成功'
          });

        }
      }).finally(() => {
        this.spinnerService.hide();
      });
  }
  GroupPersonEdit(modal, EditPerson) {
    if (EditPerson != null) {
      this.EditGroupPerson = JSON.parse(JSON.stringify(EditPerson));
    } else {
      this.EditGroupPerson = new GroupPerson();
      this.EditGroupPerson.GroupId = this.SelectGroup.SYS_Group_Id;
    }
    this.openmodal(modal, '')
  }
  GroupSelected(e) {
    if (e.selected.length > 0) {
      this.SelectGroup = e.selected[0];
    }

  }
  RoleSelected(e) {
    this.RolePermissionData = e.selected[0].RolePermissionList;
  }
  ReturnAccount(account: Account) {
    switch (this.PersonReturnType) {
      case "GroupManager":
        this.EditPermissionGroup.ManagerName = account.EmployeeName;
        this.EditPermissionGroup.ManagerAccount = account.EmployeeAccount;
        break;
      case "GroupPerson":
        this.EditGroupPerson.EmployeeName = account.EmployeeName;
        this.EditGroupPerson.Account = account.EmployeeAccount;
        break;
      default:
        break;
    }
  }
  //#endregion
  openmodal(modal, size) {
    this.modalService.open(modal, { centered: true, size: size });
  }
}
