import join from "url-join"
import path from "path";

export function normalizeRoute(...routes:string[]){

    let url = join(...routes);
    if(path.isAbsolute(url)){
        return url;
    }else{
        return join("/",url).replace(/^\/{2,}/,"/")
    }
}