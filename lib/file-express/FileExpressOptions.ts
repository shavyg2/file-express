import { ParamType } from "./ParamType";
export interface FileExpressOptions {
    ext: string[];
    // paramType: ParamType;
    basedir:string;
    live?:boolean,
    verbose?:boolean
}
