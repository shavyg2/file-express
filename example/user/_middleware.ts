


export function userMiddleware(req,res,next){
    console.log("user middleware");
    next();
}