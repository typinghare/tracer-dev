"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../../../lib/decorator");
let Find = class Find {
    main(keys) { }
    $keys() { }
    update() { }
    remove() { }
};
__decorate([
    (0, decorator_1.Execute)(),
    (0, decorator_1.Return)('List<Obj<K, V>>', 'Find memos.'),
    (0, decorator_1.Param)('keys', ['Str', 'List<Str>'], 'Key words of memo.'),
    __param(0, decorator_1.Required)
], Find.prototype, "main", null);
__decorate([
    (0, decorator_1.Completion)('keys')
], Find.prototype, "$keys", null);
__decorate([
    (0, decorator_1.Option)('update', 'u')
], Find.prototype, "update", null);
__decorate([
    (0, decorator_1.Option)('remove', 'r')
], Find.prototype, "remove", null);
Find = __decorate([
    (0, decorator_1.Service)('find')
], Find);
//# sourceMappingURL=find.js.map