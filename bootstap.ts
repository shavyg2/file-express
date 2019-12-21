import { ExpressBootstrap } from "./lib/ExpressBootStrap/ExpressBootstrap";

import express from "express";
import { ParamType } from "./lib/file-express/ParamType";

const app = express();

const router = express.Router();

app.use("/api",router);

const boot = new ExpressBootstrap(router)
boot.boot({
    basedir:"example",
    ext:[".ts",".js"],
    paramType:ParamType.Brackets
})


app.listen(process.env.PORT || 3000);