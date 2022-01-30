"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
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
//# sourceMappingURL=metadata.js.map