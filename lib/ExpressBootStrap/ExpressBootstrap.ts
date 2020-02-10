import { FileExpressOptions } from "../file-express/FileExpressOptions";
import { DirectorySearcher } from "../Searcher/DirectorySearcher";
import { ExpressRouteBuilder, ExpressHandlerBuilder } from "../RouteBuilder/ExpressRouteBuilder";
import express from "express";
import pkg from "pkg-up";
import { dirname } from "path";
import strRegex from "regex-parser";
import escape from "escape-string-regexp";
import join from "url-join";
import { normalizeRoute } from "../../util/route-join";
import { RouterConfig } from "../RouteBuilder/RouterConfig";
import { RouteConfig } from "../RouteBuilder/RouteConfig";
import { RouterSearcher } from "../Searcher/RouteSearcher";
import { MiddlewareSearcher } from "../Searcher/MiddlewareSearcher";




export class ExpressBootstrap {


    constructor(private app: import("express").IRouter) {

    }

    boot<T extends FileExpressOptions>(options: T) {
        const directorySearcher = new DirectorySearcher(options);

        const routeSearcher = new RouterSearcher(directorySearcher, options);
        const middlewareSearcher = new MiddlewareSearcher(directorySearcher, options);


        const directoryResults = routeSearcher.search();
        const middlewareResults = middlewareSearcher.search();




        const middlewareRoutes = new ExpressRouteBuilder().getRoutes(middlewareResults)
        const routes = new ExpressRouteBuilder().getRoutes(directoryResults);


        const middlewareConfig = new ExpressHandlerBuilder().build(middlewareRoutes);
        const routeConfig = new ExpressHandlerBuilder().build(routes);

        const routeList = {} as { [key: string]: express.Router };

        
        //create all middlewares
        middlewareConfig.forEach(routeHandles => {

            const routePath = normalizeRoute(routeHandles.route);
            const router = routeList[routePath] || (routeList[routePath] = express.Router());


            routeHandles.config.forEach((middlewareHandle)=>{
                
                    const middlewareHandlers = require(middlewareHandle.required) as {[key:string]:express.RequestHandler};
                    Object.entries(middlewareHandlers).forEach(([name,handler])=>{
                        if(handler){
                            router.use(handler)
                        }
                    })
            });

        });

        routeConfig.forEach(routeHandles => {

            const routePath = normalizeRoute(routeHandles.route);
            const router = routeList[routePath] || (routeList[routePath] = express.Router());

            routeHandles.config.forEach(handle => {

                if (options.verbose) {
                    logRouteBootInfo<T>(options, routeHandles, handle);
                }

                router.all(normalizeRoute(handle.path), (req, res, next) => {
                    const handler = require(handle.required);
                    const handlerName = Object.keys(handler)[0]
                    if (handler[handlerName]) {
                        if (options.verbose) {
                            logRouteInfo(routeHandles, handle, handlerName);
                        }
                        handler[handlerName](req, res, next)
                    } else {
                        next();
                    }

                    if (options.live) {
                        const dir = dirname(pkg.sync());
                        Object.entries(require.cache).forEach(([key]) => {
                            if (strRegex(escape(dir)).test(key) && !/node_modules/.test(key)) {
                                delete require.cache[key]
                            }
                        })
                    }
                })
            })
        })

        Object.entries(routeList).forEach(([route,router])=>{
            this.app.use(route,router);
        })

    }

}

function logRouteBootInfo<T extends FileExpressOptions>(options: T, routeHandles: RouterConfig, handle: RouteConfig) {
    console.log(`
${join(options.route || "/", routeHandles.route, handle.path)}
               `.trim());
}
function logRouteInfo(route: RouterConfig, handle: RouteConfig, name: string) {
    console.log("\n" + `
${route.route}
    ${handle.path}
        (${name}): ${handle.filepath}
                        `.trim());
}
