



export function middleware(req,res,next){
    console.log("calling root middleware");
    next();
}