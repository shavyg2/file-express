import { FileExpressOptions } from "../file-express/FileExpressOptions";
import { DirectorySearchResult } from "../Searcher/DirectorySearchResults";
import { dirname, resolve } from "path";
import leven from "leven";
import join from "url-join";
import parser from "regex-parser";
import escapeRegex from "escape-string-regexp";
import { RouteConfig } from "./RouteConfig";
import { RouterConfig } from "./RouterConfig";




export class ExpressRouteBuilder{

    constructor(){

    }

    getRoutes(searchResults:DirectorySearchResult[],store={} as {[key:string]:DirectorySearchResult[]}){

        searchResults.forEach(result=>{
            let currentPath = result.relativePath;
            do{
                const collections = store[currentPath] = store[currentPath] || [];
                collections.push(result);
                currentPath = dirname(currentPath);
            }while(currentPath!=="/")
        })

        const routeWithoutParams = Object.entries(store)
        .filter(([route,config])=>!route.match(parser(`/${escapeRegex(":")}[A-z0-9]/i`)));


        const routeWithoutParamsSorted = routeWithoutParams.sort(([k1,v1],[k2,v2])=>{
            return leven(k1,k2)
        }) || routeWithoutParams;



        routeWithoutParamsSorted.forEach(([key,routeContainer],index1)=>{
            
            routeWithoutParamsSorted.forEach(([key2,routeContainer2],index2)=>{

                if(index1===index2){
                    return;
                }

                const copy1 = routeContainer.slice(0);
                const copy2 = routeContainer2.slice(0);

                copy1.forEach((routeConfig,index)=>{
                    
                    if(routeContainer2.indexOf(routeConfig)==-1){
                        return;
                    }
                    
                    const furtherDown = index1<index2;
                    const betterPlacement = copy2.length > copy1.length;

                    //ensure route config is only located in one optimal path
                    if(furtherDown && betterPlacement){
                        routeContainer.splice(routeContainer.indexOf(routeConfig),1);
                    }else{
                        routeContainer2.splice(routeContainer2.indexOf(routeConfig),1)
                    }
                })
                
            })
        })


        return routeWithoutParamsSorted.reduce((a,[key,value])=>{
            if(value.length>0){
                return Object.assign(a,{[key]:value});
            }else{
                return a;
            }
        },{} as {[key:string]:DirectorySearchResult[]})
    }
}


export class ExpressHandlerBuilder{
    build(routes:{[key:string]:DirectorySearchResult[]}){
        const appSettings = Object.entries(routes).map(([route,routeOptions]):RouterConfig=>{
            
            const config = routeOptions.map((option):RouteConfig=>{
                const path = join("/",option.relativePath.replace(parser(`/^${escapeRegex(route)}/`),"")) || "/";
                const filepath = option.filepath;
                return {
                    path,
                    filepath,
                    required:resolve(filepath).replace(option.ext,"")
                }
            });

            return {
                route,
                config
            }
        });


        return appSettings;
    }
}
