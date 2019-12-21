import { FileExpressOptions } from "./FileExpressOptions";
import { ParamType } from "./ParamType";
export const defaultNodeConfig: FileExpressOptions = {
    ext: [".js"],
    paramType: ParamType.Brackets,
    basedir:"."
};
