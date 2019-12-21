import { readdirSync, statSync } from "fs";
import { join, extname, resolve, parse } from "path";
import { DirectorySearchResult } from "./DirectorySearchResults";
import { FileExpressOptions } from "../file-express/FileExpressOptions";
import parser from "regex-parser";
import escape = require("escape-string-regexp");

export class DirectorySearcher {
    constructor(private options: FileExpressOptions) {

        
    }


    get fullBase(){
        return resolve(this.options.basedir);
    }


    get isInBase(){
        return parser(`/^${escape(this.fullBase)}/`);
    }
    search(directory:string = this.options.basedir): DirectorySearchResult[] {
        const fullBase = this.fullBase//resolve(this.options.basedir);
        const isInBase = this.isInBase//parser(`/^${escape(fullBase)}/`);
        const dir = readdirSync(directory);
        const directoryMap = dir.map(file => {
            switch (file) {
                case ".":
                    return null as never;
                case "..":
                    return null as never;
                default:
                    const filepath = join(directory, file);
                    const stat = statSync(filepath);
                    const ext = extname(filepath);
                    const relativePath=this.getRelativeRoutePath(filepath, ext);
                    const result: DirectorySearchResult = {
                        directory,
                        filepath,
                        stat,
                        isFile: stat.isFile(),
                        isDirectory: stat.isDirectory(),
                        ext,
                        relativePath,
                    };
                    return result;
            }
        }).filter(x => x).filter(x=>{
            const fullFile = resolve(x.filepath);
            return isInBase.test(fullFile);
        });
        const directoriesOnly = directoryMap.filter(x => {
            return x.isDirectory;
        });
        const filesOnly = directoryMap.filter(x => {
            return x.isFile;
        }).filter(x => {
            return this.options.ext.map(x => x.toLocaleLowerCase()).includes(x.ext.toLowerCase());
        });
        const subdirFiles = directoriesOnly.map(x => this.search(x.filepath)).reduce((a, b) => {
            return a.concat(b);
        }, []);
        const files = filesOnly.concat(subdirFiles);

        return files;
    }

    private getRelativeRoutePath(filepath: string, ext: string) {
        return resolve(filepath).replace(this.isInBase, "").replace(ext, "").replace(/\[([^\]]+)\]/g, ":$1").replace(/\\{1,2}/g, "/");
    }
}
