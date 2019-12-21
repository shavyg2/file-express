import { DirectorySearcher } from "../DirectorySearcher/DirectorySearcher"
import { ParamType } from "../file-express/ParamType"
import { ExpressRouteBuilder, ExpressHandlerBuilder } from "./ExpressRouteBuilder"










describe("Express Route Builder",()=>{


    let searcher = new DirectorySearcher({
        ext:[".ts",".js"],
        paramType:ParamType.Brackets,
        basedir:"example"
    })


    it("should be able to sort and create routes",()=>{
        const builder = new ExpressRouteBuilder();  
        const map = builder.getRoutes(searcher.search());
    })


    it("should be able to create app settings",()=>{
        const builder = new ExpressRouteBuilder();  
        const map = builder.getRoutes(searcher.search());
        const handles = new ExpressHandlerBuilder().build(map);

        console.log(JSON.stringify(handles,null,2));
    })
})