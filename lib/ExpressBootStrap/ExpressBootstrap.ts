import { FileExpressOptions } from "../file-express/FileExpressOptions";
import { DirectorySearcher } from "../DirectorySearcher/DirectorySearcher";
import { ExpressRouteBuilder, ExpressHandlerBuilder } from "../RouteBuilder/ExpressRouteBuilder";
import express from "express";
import pkg from "pkg-up";
import { dirname } from "path";
import strRegex from "regex-parser";
import escape from "escape-string-regexp";
import join from "url-join";
import { routeJoin } from "../../util/route-join";




export class ExpressBootstrap {


    constructor(private app: import("express").IRouter) {

    }

    boot<T extends FileExpressOptions>(options: T) {
        const directoryResults = new DirectorySearcher(options).search();
        const routes = new ExpressRouteBuilder().getRoutes(directoryResults);
        const handles = new ExpressHandlerBuilder().build(routes);

        handles.forEach(route => {
            const router = express.Router();
            this.app.use(routeJoin(route.route), router);

            route.config.forEach(handle => {
                if (options.verbose) {
                    console.log(`
${join(options.route||"/",route.route,handle.path)}
                   `.trim() + "\n")
                }

                router.all(routeJoin(handle.path), (req, res, next) => {
                    const handler = require(handle.required);
                    const name = Object.keys(handler)[0]
                    if (handler[name]) {
                        if (options.verbose) {
                            console.log("\n" + `
${route.route}
    ${handle.path}
        (${name}): ${handle.filepath}
                        `.trim() + "\n")
                        }
                        handler[name](req, res, next)
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

    }
}