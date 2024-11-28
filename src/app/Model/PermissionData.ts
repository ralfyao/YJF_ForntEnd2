export class Page{
  SYS_PageId:number=0;
  PageUrl:string="";
  PageLocation:string="";
  IsMain:boolean=true;
  MainPage:number=1;
}
export class PermissionGroup{
  SYS_Group_Id:number=0;
  GroupName:string="";
  ManagerAccount:string="";
  ManagerName:string="";
  GroupPermissionList:Array<GroupPermission>=new Array<GroupPermission>();
  PermissionRoleList:Array<GroupRole>=new Array<GroupRole>();
  GroupPersonList:Array<GroupPerson>=new Array<GroupPerson>();
}

export class GroupPermission{
  SYS_Group_Id:number=0;
  GroupName:string="";
  YJFEmployeeCode:string="";
  ManagerAccount:string="";
  EmployeeName:string="";
  PageCode:string="";
  MenuGroupName:string="";
  MenuName:string="";
  SYS_GroupPermission_Id:number=0;
  HasPermission:boolean=false;

}
export class GroupRole{
  RoleId:number=0;
  GroupId:number=0;
  Name:string="";
  RolePermissionList:Array<RolePermission>=new Array<RolePermission>();
}
export class GroupPerson{
  PersonId:number=0;
  GroupId:number=0;
  RoleId:number=0;
  RoleName:string="";
  Account:string="";
  EmployeeName:string="";
}
export class RolePermission{
  RolePermissionId:number=0;
  GroupPermissionId:number=0;
  RoleId:number=0;
  PageName:string="";
  MenuGroup:string="";
  MenuName:string="";
  HasPermission:string="";
}
export class Account{
  USR_Employee_ID:number=0;
  EmployeeAccount:string="";
  EmployeeName:string="";
  YJFEmployeeCode:string="";
}
