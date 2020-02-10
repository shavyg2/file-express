import api from "lambda-method"

export default api(function hello(){
    return {
        message:"hello"
    }
})