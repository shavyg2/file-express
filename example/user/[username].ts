import api from "lambda-method";

export default api.get((req,res)=>{

    console.log(req.params);
    return {
        username:req.params.username,
        "logic":false
    }
});