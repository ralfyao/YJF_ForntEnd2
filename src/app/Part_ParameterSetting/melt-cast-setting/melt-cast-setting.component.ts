import { Component, OnInit } from '@angular/core';
import { ParameterSettingService } from 'src/app/Service/parameter-setting.service';
import { MaterialListReq, MaterialListRep, AddMaterialReq, MaterialReq } from 'src/app/Model/ParamaterSetting';
import { HttpErrorResponse } from '@angular/common/http';
import { Model_PouringMaterial } from 'src/app/Model/PouringData';
import { SessionStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-melt-cast-setting',
  templateUrl: './melt-cast-setting.component.html',
  styleUrls: ['./melt-cast-setting.component.css'],
  providers: [ParameterSettingService]
})
export class MeltCastSettingComponent implements OnInit {

  /* #region  分頁器 */
  public PageCount: number = 7;
  public TotalCount: number = 0;
  public Page: number = 1;
  /* #endregion */

  public searchString = "";

  /* #region DB資料  */
  public sourcelistary: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>();
  public sourcelistpageary: Array<Model_PouringMaterial> = new Array<Model_PouringMaterial>();
  /* #endregion */

  /* #region  Select資料 */
  public selectedMaterialType: string = "FC300"
  public materialTypes: Array<string> = new Array<string>();
  /* #endregion */


  public checkedMaterialary: Array<MaterialListRep> = new Array<MaterialListRep>();

  constructor(private rest: ParameterSettingService,
    private session: SessionStorageService) { }

  ngOnInit() {
    this.loadSourceMaterialList();
  }

  loadSourceMaterialList() {
    this.rest.API_Query_PouringMaterialList().then(
      (data) => {
        this.sourcelistary = data;
        this.loadList();
      },
      (err: HttpErrorResponse) => {
        alert(err.message);
      }
    )
  }

  loadList() {
    let dto: MaterialListReq = new MaterialListReq();
    this.rest.API_Query_MaterialList(dto, "84", "").then(
      (data) => {
        this.checkedMaterialary = data.MaterialListReps;
        this.checkedMaterialary.forEach((checked, checkedindex) => {
          this.sourcelistary.forEach((source, sourceindex) => {
            if (source.MaterialNo == checked.MaterialNo && source.MaterialType == checked.MaterialType) {
              source.IsParamater = true;
            }
          });
        });
        this.datafilter();
      },
      (err: HttpErrorResponse) => {

      }
    )
  }

  addCheckedMaterial() {
    let req: AddMaterialReq = new AddMaterialReq(this.session);
    req.MaterialType = this.selectedMaterialType;
    this.sourcelistary.filter(x => x.MaterialType == this.selectedMaterialType && x.IsParamater == true).forEach(element => {
      let mat: MaterialReq = new MaterialReq();
      mat.MaterialName = element.MaterialName;
      mat.MaterialNo = element.MaterialNo;
      mat.MaterialType = element.MaterialType;
      req.MaterialReqs.push(mat);
    });
    this.rest.API_Insert_AddMaterial(req).then(
      (data) => {
        alert("更新成功");
        this.loadSourceMaterialList();
      },
      (err: HttpErrorResponse) => {
        alert("發生錯誤：" + err.message)
      }
    )
  }

  loadPage(page: any) {
    this.Page = Number(page);
    this.datafilter();
  }

  searchKetWord() {
    this.Page = 1;
    this.datafilter();
  }

  materialTypeChange(value: string) {
    this.selectedMaterialType = value;
    this.Page = 1;
    this.datafilter();
  }

  datafilter() {
    this.sourcelistpageary = new Array<Model_PouringMaterial>();
    this.materialTypes = Array.from(new Set(this.sourcelistary.map(x => x.MaterialType)));
    this.TotalCount = this.sourcelistary.filter(x => x.MaterialType == this.selectedMaterialType).length;
    if (this.searchString.length !== 0) {
      this.sourcelistpageary = this.sourcelistary
        .filter(x => x.MaterialType == this.selectedMaterialType && x.MaterialName.includes(this.searchString.trim()))
        .sort()
        .slice((this.Page * this.PageCount) - 7, (this.Page * this.PageCount));
    } else {
      this.sourcelistpageary = this.sourcelistary
        .filter(x => x.MaterialType == this.selectedMaterialType)
        .sort()
        .slice((this.Page * this.PageCount) - 7, (this.Page * this.PageCount));
    }
  }



}
