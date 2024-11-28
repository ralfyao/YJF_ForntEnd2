import { BasicAPIResponse } from "./basicAPIResponse";


export interface CommonPhrasesListResponse extends BasicAPIResponse {
    FlaskLocationList: Array<string>;
    PatternLocationList: Array<string>;
}
