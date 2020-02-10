import { DirectorySearcher } from "./DirectorySearcher";
import { FileExpressOptions } from "../file-express/FileExpressOptions";
import parser from "regex-parser";

export class MiddlewareSearcher{
    get isMiddleware(){
        return parser(`/_middleware(${this.options.ext.join("|")})/`)
    }
    constructor(private directorySearcher:DirectorySearcher,private options:FileExpressOptions){

    }

    search(directory:string = this.options.basedir){
        const results = this.directorySearcher.search(directory).filter(routes=>{
            const isMiddleware = this.isMiddleware;
            const isMiddlewareResult = isMiddleware.test(routes.filepath);
            return isMiddlewareResult;
        })
        
        return results.map(x=>{
            x.relativePath = x.relativePath.replace(/_middleware$/,"");
            return x;
        })
    }
}