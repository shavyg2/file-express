import { FileExpressOptions } from "../file-express/FileExpressOptions";
import { DirectorySearchResult } from "../DirectorySearcher/DirectorySearchResults";
import { dirname, resolve } from "path";
import leven from "leven";
import express from "express";
import join from "url-join";
import strRegex from "regex-parser";
import escapeRegex from "escape-string-regexp";
import { RouteConfig } from "./RouteConfig";
import { RouterConfig } from "./RouterConfig";




export class ExpressRouteBuilder{

    constructor(){

    }



    getRoutes(files:DirectorySearchResult[],store={} as {[key:string]:DirectorySearchResult[]}){
        files.forEach(x=>{
            let currentPath = x.relativePath;
            do{
                const collections = store[currentPath] = store[currentPath] || [];
                collections.push(x);
                currentPath = dirname(currentPath);
            }while(currentPath!=="/")
        })

        const list = Object.entries(store).filter(x=>!x[0].match(strRegex(`/${escapeRegex(":")}[A-z0-9]/i`)));
        const sortedList = list.sort(([k1,v1],[k2,v2])=>{
            return leven(k1,k2)
        }) || list;



        sortedList.forEach(([key,routeContainer],index1)=>{
            
            sortedList.forEach(([key2,routeContainer2],index2)=>{

                if(index1===index2){
                    return;
                }

                const copy1 = routeContainer.slice(0);
                const copy2 = routeContainer2.slice(0);

                copy1.forEach((x,index)=>{
                    
                    if(routeContainer2.indexOf(x)==-1){
                        return;
                    }
                    const furtherDown = index1<index2;
                    const betterPlacement = copy2.length > copy1.length;

                    if(furtherDown && betterPlacement){
                        routeContainer.splice(routeContainer.indexOf(x),1);
                    }else{
                        routeContainer2.splice(routeContainer2.indexOf(x),1)
                    }
                })
                
            })
        })


        return sortedList.reduce((a,[key,value])=>{
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
                const path = join("/",option.relativePath.replace(strRegex(`/^${escapeRegex(route)}/`),"")) || "/";
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
