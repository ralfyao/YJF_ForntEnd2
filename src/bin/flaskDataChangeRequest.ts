import { FlaskList } from "src/app/Model/production";

export interface FlaskDataChangeRequest {
    Account: string;
    flask: FlaskList;
}
