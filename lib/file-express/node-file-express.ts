import { FileExpress } from "./file-express";
import { Typeutil } from "../../util/TypeUtil";
import {OptionalKeys, Optional} from "utility-types";
import {resolve,basename} from "path";
import is from "@sindresorhus/is";
import { FileExpressOptions } from "./FileExpressOptions";


export class NodeFileExpress implements FileExpress{
    boot(directory: string) {
        
    }   
}

export class FileExpressRunner{

    constructor(private directory:string,private options:Optional<FileExpressOptions,"ext">){

    }


    addFile(){

    }
}





