import { DirectorySearcher } from "./DirectorySearcher"
import { ParamType } from "../file-express/ParamType"
import is from "@sindresorhus/is";



describe("Directory Searcher",()=>{

    let searcher = new DirectorySearcher({
        ext:[".ts"],
        basedir:"example"
    })


    it("should be able to get example file",()=>{
        const result = searcher.search("example");
        const file = result.filter(x=>x.filepath.match(/hello\.ts$/))[0];
        expect(is.object(file)).toBeTruthy();
    })


    it("should be able to get params in relative path",()=>{
        const result = searcher.search("example");
        const file = result.filter(x=>x.filepath.match(/\[username\]\.ts$/))[0];
        expect(file.relativePath).toBe("/user/:username");
    })
    
})