


import { ExpressBootstrap } from "../lib/ExpressBootStrap/ExpressBootstrap";
import express from "express";
import { ParamType } from "../lib/file-express/ParamType";
import { AddressInfo } from "net";
import cla from "command-line-args";



const cli = cla([
    {
        name: "dir",
        alias: "d",
        type: String,
        defaultValue: ".",
    },
    {
        name: "route",
        alias: "r",
        type: String,
        defaultValue: "/",
    },
    {
        name: "ext",
        alias: "x",
        type: String,
        defaultValue: [".ts", ".js"],
        lazyMultiple: true
    },
    {
        name: "port",
        alias: "p",
        type: Number,
        defaultValue: 3000
    },
    {
        name: "help",
        alias: "h",
        type: Boolean,
        defaultValue: false
    }
])

if (cli.help) {
    const commandLineUsage = require('command-line-usage')

    const sections = [
        {
            header: 'File Express',
            content: 'Create an api from the file system'
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'dir',
                    typeLabel: '{underline Directory}',
                    description: 'The base directory to bootstrap api.',
                    alias:"d"
                },
                {
                    name: 'ext',
                    typeLabel: '{underline Extension}',
                    description: 'The extension for the files to use. This requires the {underline .} in the extension name',
                    alias:"x"
                },
                {
                    name: 'route',
                    typeLabel: '{underline String}',
                    description: 'A path to place in front of all routes, eg {underline /api/v1}',
                    alias:"r"
                },
                {
                    name: 'port',
                    typeLabel: '{underline Number}',
                    description: 'The port to boot the application on. Default is {underline 3000}',
                    alias:"p"
                },
                {
                    name: 'help',
                    description: 'Print this usage guide.'
                }
            ]
        }
    ]
    const usage = commandLineUsage(sections)
    console.log(usage)
    process.exit(0);
}



const app = express();

const router = express.Router();
app.use(cli.route, router);

const boot = new ExpressBootstrap(router)
const options = {
    basedir: cli.dir,
    ext: cli.ext,
    paramType: ParamType.Brackets
}
boot.boot(options);


const server = app.listen(process.env.PORT || cli.port, () => {
    const address = server.address() as AddressInfo;
    console.log(`[${options.basedir}]:${address.port}`)
});