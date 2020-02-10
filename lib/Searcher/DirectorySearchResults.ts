import { Stats } from "fs";
export interface DirectorySearchResult {
    directory: string;
    filepath: string;
    stat: Stats;
    isFile: boolean;
    isDirectory: boolean;
    ext: string;
    relativePath:string
}
