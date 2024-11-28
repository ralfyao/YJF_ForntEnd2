import { Label } from 'ng2-charts';
export class ReportInfo{
  ReportId:number=0;
  ReportName:string="";
  ReportSourceId:number=0;
  SourceAPI:string="";
  ReportType:string="";
  IsPreset:boolean=false;
  Creator:string="";
  FieldList:Array<ReportField>=new Array<ReportField>();
}

export class ReportField{
  FieldId:number=0;
  SourceFieldId:number=0;
  FieldCode:string="";
  FieldName:string="";
  FieldType:string="";
  FieldWidth:number=0;
  Sequence:number=0;
  ReportId:number=0;
  IsHidden:boolean=false;
  IsFilter:boolean=false;
  FilterType:string="";
  FieldClass:string="";
}

export class FilterData{
  Label:string="";
  FieldCode:string="";
  Type:string="";
  Value:string="";
  Placeholder:string=""
  StartDate:string="";
  EndDate:string="";
  DataList:Array<string>=new Array<string>();
}
export class ReportSource{
  ReportSourceId:number=0;
  SourceAPI:string="";
  SourceName:string="";
  SourceFieldList:Array<ReportSourceField>=new Array<ReportSourceField>();
}

export class ReportSourceField{
  SourceFieldId:number=0;
  SourceFieldCode:string="";
  SourceFieldName:string="";
  SourceFieldType:string="";
  Sequence:number=0;
}
