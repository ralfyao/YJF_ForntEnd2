import { BasicAPIResponse } from "./basicAPIResponse";
import { FlaskListQueryResponseFlaskSelectList } from "./flaskListQueryResponseFlaskSelectList";

export interface FlaskListQueryResponse extends BasicAPIResponse {
    FlaskSelectList: Array<FlaskListQueryResponseFlaskSelectList>
}
