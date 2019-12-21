import { FileExpressOptions } from "../file-express/FileExpressOptions";
import { DirectorySearcher } from "../DirectorySearcher/DirectorySearcher";
import { ExpressRouteBuilder, ExpressHandlerBuilder } from "../RouteBuilder/ExpressRouteBuilder";
import express from "express";




export class ExpressBootstrap{


    constructor(private app:import("express").IRouter){

    }

    boot<T extends FileExpressOptions>(options:T){
       const directoryResults =  new DirectorySearcher(options).search();
       const routes = new ExpressRouteBuilder().getRoutes(directoryResults);
       const handles = new ExpressHandlerBuilder().build(routes);

       handles.forEach(route=>{
           const router = express.Router();
           this.app.use(route.route,router);

           route.config.forEach(handle=>{
               router.all(handle.path,(req,res,next)=>{
                    const handler = require(handle.required);
                    const name = Object.keys(handler)[0]
                    if(handler[name]){
                        if(options.verbose){
                        console.log("\n"+`
${route.route}
    ${handle.path}
        (${name}): ${handle.filepath}
                        `.trim()+"\n")}
                        handler[name](req,res,next)
                    }else{
                        next();
                    }

                    if(options.live){
                        delete require.cache[require.resolve(handle.required)];
                    }
               })
           })
       })

    }
}