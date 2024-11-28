import { BasicAPIResponse } from "./basicAPIResponse";
import { QueryFlaskListResponseFlaskLists } from "./queryFlaskListResponseFlaskLists";

export interface QueryFlaskListResponse extends BasicAPIResponse {
    FlaskLists: Array<QueryFlaskListResponseFlaskLists>
}
