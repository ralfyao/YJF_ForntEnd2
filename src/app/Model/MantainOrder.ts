import { SessionStorageService } from 'ngx-webstorage';
import { LoginSessionEnum } from '../Enum/session-enum.enum';

/**參數設定基底物件
 * @export
 * @abstract
 * @class ParameterModelBase
 */
export abstract class ParameterModelBase {
    constructor(private session: SessionStorageService) { }
    public GetValue(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        return v;
    }

    public GetLoginAccount() {
        let v: string = this.session.retrieve(LoginSessionEnum.UserAccount);
        if (v == null || v == undefined) {
            v = "";
        }
        return v;
    }
}

/**新增保修資料Req
 * @export
 * @class ReqAddMaintain
 */
export class ReqAddMaintain {
    private solution: string = "";
    private name: string = "";
    private maintainCode: string = "";
    private documentNumber: string = "";
    private documentType: string = "";
    private reason: string = "";
    private expectedHours: string;
    private expectedDate: string;
    private expectedEndDate: string;
    private actualDate: string;
    private actualHours: string;
    private maintainAmount: string;
    private actualEndDate: string;
    private repairPersonCount: string;
    private remark: string;
    private tQ008: string;
    private tQ009: string;
    private tQ011: string;
    private tQ012: string;
    private tQ013: string;
    private tQ014: string;
    private uDF01: string;
    private uDF02: string;

    /**保修單別*/
    public get DocumentType(): string {
        return this.documentType;
    }
    public set DocumentType(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.documentType = v;
    }

    /**保修單別 */
    public get DocumentNumber(): string {
        return this.documentNumber;
    }
    public set DocumentNumber(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.documentNumber = v;
    }

    /**保修代號*/
    public get MaintainCode(): string {
        return this.maintainCode;
    }
    public set MaintainCode(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.maintainCode = v;
    }

    /**保修名稱*/
    public get Name(): string {
        return this.name;
    }
    public set Name(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.name = v;
    }

    /** 保修原因*/
    public get Reason(): string {
        return this.reason;
    }
    public set Reason(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.reason = v;
    }

    /*解決方法*/
    public get Solution(): string {
        return this.solution;
    }
    public set Solution(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.solution = v;
    }

    /*預計保修時間*/
    public get ExpectedHours(): string {

        return this.expectedHours;
    }
    public set ExpectedHours(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.expectedHours = v;
    }

    /*預計保修日*/
    public get ExpectedDate(): string {
        return this.expectedDate;
    }
    public set ExpectedDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.expectedDate = v;
    }

    /*預計完工日*/
    public get ExpectedEndDate(): string {
        return this.expectedEndDate;
    }
    public set ExpectedEndDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.expectedEndDate = v;
    }

    /**實際保修日*/
    public get ActualDate(): string {
        return this.actualDate;
    }
    public set ActualDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.actualDate = v;
    }

    /*實際完工日*/
    public get ActualEndDate(): string {
        return this.actualEndDate;
    }
    public set ActualEndDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.actualEndDate = v;
    }

    /*實際保修時數*/
    public get ActualHours(): string {
        return this.actualHours;
    }
    public set ActualHours(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.actualHours = v;
    }

    /*保修金額*/
    public get MaintainAmount(): string {
        return this.maintainAmount;
    }
    public set MaintainAmount(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.maintainAmount = v;
    }

    /*維修人數*/
    public get RepairPersonCount(): string {
        return this.repairPersonCount;
    }
    public set RepairPersonCount(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.repairPersonCount = v;
    }

    /*備註*/
    public get Remark(): string {
        return this.remark;
    }
    public set Remark(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.remark = v;
    }

    /*處理代號*/
    public get TQ008(): string {
        return this.tQ008;
    }
    public set TQ008(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ008 = v;
    }

    /*處理內容*/
    public get TQ009(): string {
        return this.tQ009;
    }
    public set TQ009(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ009 = v;
    }

    /*原幣未稅金額*/
    public get TQ011(): string {
        return this.tQ011;
    }
    public set TQ011(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ011 = v;
    }

    /*原幣稅額*/
    public get TQ012(): string {
        return this.tQ012;
    }
    public set TQ012(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ012 = v;
    }

    /*本幣未稅金額*/
    public get TQ013(): string {
        return this.tQ013;
    }
    public set TQ013(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ013 = v;
    }

    /*本幣稅額 */
    public get TQ014(): string {
        return this.tQ014;
    }
    public set TQ014(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ014 = v;
    }

    /*單價*/
    public get UDF01(): string {
        return this.uDF01;
    }
    public set UDF01(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.uDF01 = v;
    }

    /*數量*/
    public get UDF02(): string {
        return this.uDF02;
    }
    public set UDF02(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.uDF02 = v;
    }

}

/**修改保修單Req
 * @export
 * @class ReqUpdateMaintain
 */
export class ReqUpdateMaintain {
    private solution: string = "";
    private name: string = "";
    private maintainCode: string = "";
    private documentNumber: string = "";
    private documentType: string = "";
    private reason: string = "";
    private expectedHours: string = "";;
    private expectedDate: string = "";;
    private expectedEndDate: string = "";;
    private actualDate: string = "";;
    private actualHours: string = "";;
    private maintainAmount: string = "";;
    private actualEndDate: string = "";;
    private repairPersonCount: string = "";;
    private remark: string = "";;
    private tQ008: string = "";;
    private tQ009: string = "";;
    private tQ011: string = "";;
    private tQ012: string = "";;
    private tQ013: string = "";;
    private tQ014: string = "";;
    private uDF01: string = "";;
    private uDF02: string = "";;
    private serialNumber: string = "";;

    /*保修序號*/
    public get SerialNumber(): string {
        return this.serialNumber;
    }
    public set SerialNumber(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.serialNumber = v;
    }


    /**保修單別*/
    public get DocumentType(): string {
        return this.documentType;
    }
    public set DocumentType(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.documentType = v;
    }

    /**保修單別 */
    public get DocumentNumber(): string {
        return this.documentNumber;
    }
    public set DocumentNumber(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.documentNumber = v;
    }

    /**保修代號*/
    public get MaintainCode(): string {
        return this.maintainCode;
    }
    public set MaintainCode(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.maintainCode = v;
    }

    /**保修名稱*/
    public get Name(): string {
        return this.name;
    }
    public set Name(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.name = v;
    }

    /** 保修原因*/
    public get Reason(): string {
        return this.reason;
    }
    public set Reason(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.reason = v;
    }

    /*解決方法*/
    public get Solution(): string {
        return this.solution;
    }
    public set Solution(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.solution = v;
    }

    /*預計保修時間*/
    public get ExpectedHours(): string {

        return this.expectedHours;
    }
    public set ExpectedHours(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.expectedHours = v;
    }

    /*預計保修日*/
    public get ExpectedDate(): string {
        return this.expectedDate;
    }
    public set ExpectedDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.expectedDate = v;
    }

    /*預計完工日*/
    public get ExpectedEndDate(): string {
        return this.expectedEndDate;
    }
    public set ExpectedEndDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.expectedEndDate = v;
    }

    /**實際保修日*/
    public get ActualDate(): string {
        return this.actualDate;
    }
    public set ActualDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.actualDate = v;
    }

    /*實際完工日*/
    public get ActualEndDate(): string {
        return this.actualEndDate;
    }
    public set ActualEndDate(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.actualEndDate = v;
    }

    /*實際保修時數*/
    public get ActualHours(): string {
        return this.actualHours;
    }
    public set ActualHours(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.actualHours = v;
    }

    /*保修金額*/
    public get MaintainAmount(): string {
        return this.maintainAmount;
    }
    public set MaintainAmount(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.maintainAmount = v;
    }

    /*維修人數*/
    public get RepairPersonCount(): string {
        return this.repairPersonCount;
    }
    public set RepairPersonCount(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.repairPersonCount = v;
    }

    /*備註*/
    public get Remark(): string {
        return this.remark;
    }
    public set Remark(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.remark = v;
    }

    /*處理代號*/
    public get TQ008(): string {
        return this.tQ008;
    }
    public set TQ008(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ008 = v;
    }

    /*處理內容*/
    public get TQ009(): string {
        return this.tQ009;
    }
    public set TQ009(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ009 = v;
    }

    /*原幣未稅金額*/
    public get TQ011(): string {
        return this.tQ011;
    }
    public set TQ011(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ011 = v;
    }

    /*原幣稅額*/
    public get TQ012(): string {
        return this.tQ012;
    }
    public set TQ012(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ012 = v;
    }

    /*本幣未稅金額*/
    public get TQ013(): string {
        return this.tQ013;
    }
    public set TQ013(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ013 = v;
    }

    /*本幣稅額 */
    public get TQ014(): string {
        return this.tQ014;
    }
    public set TQ014(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.tQ014 = v;
    }

    /*單價*/
    public get UDF01(): string {
        return this.uDF01;
    }
    public set UDF01(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.uDF01 = v;
    }

    /*數量*/
    public get UDF02(): string {
        return this.uDF02;
    }
    public set UDF02(v: string) {
        if (v == null || v == undefined) {
            v = "";
        }
        this.uDF02 = v;
    }

}