import { DirectorySearcher } from "./DirectorySearcher";
import { FileExpressOptions } from "../file-express/FileExpressOptions";
import parser from "regex-parser";

export class RouterSearcher{
    get isMiddleware(){
        return parser(`/_middleware\.(${this.options.ext.join("|")})/`)
    }
    constructor(private directorySearcher:DirectorySearcher,private options:FileExpressOptions){

    }

    search(directory:string = this.options.basedir){
        return this.directorySearcher.search(directory).filter(routes=>{
            return !this.isMiddleware.test(routes.filepath);
        })
    }
}