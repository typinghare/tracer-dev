"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Completion = exports.Required = exports.Param = exports.Option = exports.Return = exports.Execute = exports.Service = exports.Metadata = void 0;
const scan_1 = require("./scan");
require("reflect-metadata");
var Metadata;
(function (Metadata) {
    function get(key, target, propertyKey) {
        return propertyKey ?
            Reflect.getMetadata(key, target, propertyKey) :
            Reflect.getMetadata(key, target);
    }
    Metadata.get = get;
    function set(key, value, target, propertyKey) {
        propertyKey
            ? Reflect.defineMetadata(key, value, target, propertyKey)
            : Reflect.defineMetadata(key, value, target);
    }
    Metadata.set = set;
    function remove(key, value, target, propertyKey) {
        propertyKey ?
            Reflect.deleteMetadata(key, target, propertyKey) :
            Reflect.deleteMetadata(key, target);
    }
    Metadata.remove = remove;
    function push(key, value, target, propertyKey) {
        const list = get(key, target, propertyKey) || [];
        if (!Array.isArray(list))
            return;
        list.push(value);
        set(key, list, target, propertyKey);
    }
    Metadata.push = push;
})(Metadata = exports.Metadata || (exports.Metadata = {}));
function Service(serviceName) {
    return function (constructor) {
        scan_1.Scan.loader.registerService(serviceName);
        scan_1.Scan.loader.saveServiceConstructor(constructor);
    };
}
exports.Service = Service;
function Execute() {
    return function (target, propertyKey, descriptor) {
        Metadata.set('ExecuteFunction', descriptor.value, target.constructor);
    };
}
exports.Execute = Execute;
function Return(type, intro) {
    return function (target, propertyKey) {
        Metadata.set('returnIntro', intro, target.constructor, propertyKey);
        Metadata.set('returnType', type, target.constructor, propertyKey);
    };
}
exports.Return = Return;
function Option(long, short) {
    return function (target, propertyKey, descriptor) {
        const option = new scan_1.Scan.Option(long, short);
        option.executeFunction = descriptor.value;
        Metadata.push('optionList', option, target.constructor);
    };
}
exports.Option = Option;
function Param(name, type, intro) {
    return function (target, propertyKey) {
        const param = new scan_1.Scan.Param(name);
        param.intro = intro;
        param.typeList = Array.isArray(type) ? type : [type];
        Metadata.push('paramList', param, target.constructor, propertyKey);
    };
}
exports.Param = Param;
function Required(target, propertyKey, parameterIndex) {
    Metadata.push('requiredParamIndexList', parameterIndex, target.constructor, propertyKey);
}
exports.Required = Required;
function Completion(paramName, optionName) {
    return function (target, propertyKey, descriptor) {
        const info = [paramName, optionName, descriptor.value];
        Metadata.set('completion', info, target.constructor, propertyKey);
    };
}
exports.Completion = Completion;
//# sourceMappingURL=decorator.js.map