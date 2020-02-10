import api from "lambda-method";
import { AppName } from "../_util/name";

export default api.get((req,res)=>{
    return {
        username:req.params.username,
        AppName   
    }
});