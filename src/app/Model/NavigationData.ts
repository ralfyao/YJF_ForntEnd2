export class NavigationItem{
  SYS_MenuId:number;
  MenuIndex:number=1;
  Name:string="";
  Code:string="";
  Icon:string="";
  GroupId:number=1;
  GroupName:string="";
  GroupIcon:string="";
}
export class NavigationGroup{
  SYS_MenuGroupId:number=0;
  GroupIndex:number=1;
  GroupIcon:string="";
  GroupName:string="";
  IsHidden:boolean=false;
  Children:Array<NavigationItem>=new Array<NavigationItem>();
}
