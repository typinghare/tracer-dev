"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Completion = exports.Required = exports.Param = exports.Option = exports.Return = exports.Execute = exports.Service = void 0;
const scan_1 = require("./scan");
const metadata_1 = require("./metadata");
function Service(serviceName) {
    return function (constructor) {
        scan_1.Scan.loader.registerService(serviceName);
        scan_1.Scan.loader.saveServiceConstructor(constructor);
    };
}
exports.Service = Service;
function Execute() {
    return function (target, propertyKey, descriptor) {
        metadata_1.Metadata.set('ExecuteFunction', descriptor.value, target.constructor);
    };
}
exports.Execute = Execute;
function Return(type, intro) {
    return function (target, propertyKey) {
        metadata_1.Metadata.set('returnIntro', intro, target.constructor, propertyKey);
        metadata_1.Metadata.set('returnType', type, target.constructor, propertyKey);
    };
}
exports.Return = Return;
function Option(long, short) {
    return function (target, propertyKey, descriptor) {
        const option = new scan_1.Scan.Option(long, short);
        option.executeFunction = descriptor.value;
        metadata_1.Metadata.push('optionList', option, target.constructor);
    };
}
exports.Option = Option;
function Param(name, type, intro) {
    return function (target, propertyKey) {
        const param = new scan_1.Scan.Param(name);
        param.intro = intro;
        metadata_1.Metadata.push('paramList', param, target.constructor, propertyKey);
    };
}
exports.Param = Param;
function Required(target, propertyKey, parameterIndex) {
    metadata_1.Metadata.push('requiredParamIndexList', parameterIndex, target.constructor, propertyKey);
}
exports.Required = Required;
function Completion(paramName, optionName) {
    return function (target, propertyKey, descriptor) {
        const info = [paramName, optionName, descriptor.value];
        metadata_1.Metadata.set('completion', info, target.constructor, propertyKey);
    };
}
exports.Completion = Completion;
//# sourceMappingURL=decorator.js.map