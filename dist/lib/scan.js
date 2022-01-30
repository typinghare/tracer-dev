"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scan = void 0;
const fs = require("fs");
const path = require("path");
const metadata_1 = require("./metadata");
const misc_1 = require("./misc");
var Scan;
(function (Scan) {
    class Param {
        constructor(name) {
            this.intro = '';
            this.required = false;
            this.typeList = [];
            this.name = name;
        }
    }
    Scan.Param = Param;
    class Option {
        constructor(long, short) {
            this._paramList = [];
            this.long = long;
            this.short = short;
        }
        addParam(param) {
            this._paramList.push(param);
        }
        getParam(index) {
            return this._paramList[index];
        }
    }
    Scan.Option = Option;
    class Service {
        constructor(name) {
            this.returnType = [];
            this.returnIntro = '';
            this._paramList = [];
            this._optionMap = new Map();
            this.name = name;
        }
        get paramList() {
            return this._paramList;
        }
        addOption(option) {
            this._optionMap.set(option.long, option);
        }
        getOption(long) {
            return this._optionMap.get(long);
        }
        addParam(param) {
            this._paramList.push(param);
        }
        getParam(index) {
            return this._paramList[index];
        }
    }
    Scan.Service = Service;
    class Servant {
        constructor(name) {
            this._serviceMap = new Map();
            this.name = name;
        }
        registerService(serviceName) {
            this._serviceMap.set(serviceName, new Service(serviceName));
        }
        getService(serviceName) {
            return this._serviceMap.get(serviceName);
        }
    }
    Scan.Servant = Servant;
    class ServantManager {
        constructor() {
            this._servantMap = new Map();
        }
        registerServant(servantName) {
            if (!this._servantMap.has(servantName)) {
                this._servantMap.set(servantName, new Servant(servantName));
            }
        }
        registerService(servantName, serviceName) {
            if (this._servantMap.has(servantName)) {
                const servant = this._servantMap.get(servantName);
                servant.registerService(serviceName);
            }
        }
        getServant(name) {
            return this._servantMap.get(name);
        }
    }
    Scan.ServantManager = ServantManager;
    class Loader {
        constructor() {
            this._servantManager = new ServantManager();
        }
        get servantManager() {
            return this._servantManager;
        }
        registerService(serviceName) {
            this._servantManager.registerService(this._tempServantName, serviceName);
            this._tempServiceName = serviceName;
        }
        getTempServant() {
            return this._servantManager.getServant(this._tempServantName);
        }
        scan(dirPath) {
            const dirList = fs.readdirSync(dirPath)
                .map(dir => path.join(dirPath, dir))
                .filter(dir => fs.statSync(dir).isDirectory());
            dirList.forEach(dir => this.loadServant(dir));
        }
        loadServant(dirPath) {
            const servantName = path.basename(dirPath);
            this._servantManager.registerServant(servantName);
            const servicePath = path.join(dirPath, 'service');
            const serviceFileList = fs.readdirSync(servicePath)
                .map(dir => path.join(servicePath, dir))
                .filter(file => {
                if (path.extname(file) != '.js')
                    return false;
                return fs.statSync(file).isFile();
            });
            serviceFileList.forEach(file => {
                this._tempServantName = servantName;
                require(file);
                this._assemble();
            });
        }
        saveServiceConstructor(constructor) {
            this._tempServiceConstructor = constructor;
        }
        _assemble() {
            const constructor = this._tempServiceConstructor;
            const serviceName = this._tempServiceName;
            const service = this.getTempServant().getService(serviceName);
            const executeFunction = service.executeFunction = metadata_1.Metadata.get('ExecuteFunction', constructor);
            service.returnIntro = metadata_1.Metadata.get('returnIntro', constructor, executeFunction.name);
            this._assembleParams(service, executeFunction, constructor);
            const completion = metadata_1.Metadata.get('completion', constructor, executeFunction.name);
            const optionList = metadata_1.Metadata.get('optionList', constructor);
            if (optionList) {
                for (const option of optionList) {
                    this._assembleParams(option, option.executeFunction, constructor);
                    const completion = metadata_1.Metadata.get('completion', constructor, option.executeFunction.name);
                    service.addOption(option);
                }
            }
        }
        _assembleParams(handle, executeFunction, constructor) {
            const executeFunctionName = executeFunction.name;
            const paramList = metadata_1.Metadata.get('paramList', constructor, executeFunctionName);
            if (!paramList)
                return;
            const paramNameList = (0, misc_1.getParamNameList)(executeFunction);
            const requiredParamIndexList = metadata_1.Metadata.get('requiredParamIndexList', constructor, executeFunctionName);
            for (let i = 0; i < paramNameList.length; ++i) {
                const name = paramNameList[i];
                const param = paramList.find(param => param.name == name);
                param.required = i in requiredParamIndexList;
                handle.addParam(param);
            }
        }
    }
    Scan.loader = new Loader();
})(Scan = exports.Scan || (exports.Scan = {}));
//# sourceMappingURL=scan.js.map