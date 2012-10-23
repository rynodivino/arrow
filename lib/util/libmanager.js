/*jslint forin:true sub:true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/

/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

var log4js = require("log4js"),
    fs = require("fs");

function LibManager() {
    this.logger = log4js.getLogger("LibManager");
}

LibManager.prototype.getAllTest = function (strLibPath) {
    var libs = "",
        arrLib,
        stat,
        dir,
        tmpArr,
        i,
        j;

    this.strLibPath = strLibPath;
    this.logger.trace("Normalizing libs: " + strLibPath);
    arrLib = this.strLibPath.split(",");
    for (i = 0; i < arrLib.length; i += 1) {
        try {
            stat = fs.statSync(arrLib[i]);
            if (stat.isFile()) {
                if (-1 !== arrLib[i].indexOf(".js")) {
                    libs += arrLib[i] + ",";
                } else {
                    this.logger.warn(arrLib[i] + " is not a .js file, ignoring this library !");
                }
            } else if (stat.isDirectory()) {
                dir = arrLib[i];
                if ("/" === dir.substr(dir.length - 1, dir.length)) {
                    dir = dir.substr(0, dir.length - 1);
                }
                tmpArr = fs.readdirSync(dir);
                for (j = 0; j < tmpArr.length; j += 1) {
                    if (-1 !== tmpArr[j].indexOf(".js")) {
                        libs += dir + "/" + tmpArr[j] + ",";
                    }
                }
            } else {
                this.logger.warn("Unable to read :" + arrLib[i] + ", ignoring this library !");
            }
        } catch (e) {
            this.logger.error(e.toString());
        }
    }

    if (libs) {
        libs = libs.substr(0, libs.length - 1);
    }

    this.logger.trace("Normalized libs: " + libs);
    return libs;
};

LibManager.prototype.getAllCommonLib = function (config, lib) {
    var commonLib = "";

    if (config["autolib"] && lib) {
        commonLib = config["autolib"] + "," + lib;
    } else if (config["autolib"]) {
        commonLib = config["autolib"];
    } else if (lib) {
        commonLib = lib;
    }

    if (commonLib) {
        this.logger.trace("Global libs: " + commonLib);
        return this.getAllTest(commonLib);
    }

    return "";
};

module.exports = LibManager;

