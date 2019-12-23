import { ParamType } from "./ParamType";
export interface FileExpressOptions {
    route?:string,
    ext: string[];
    // paramType: ParamType;
    basedir:string;
    live?:boolean,
    verbose?:boolean
}
