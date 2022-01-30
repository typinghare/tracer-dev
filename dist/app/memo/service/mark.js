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
let Mark = class Mark {
    main(content, label) {
    }
};
__decorate([
    (0, decorator_1.Execute)(),
    (0, decorator_1.Return)('Null', 'Mark a memo.'),
    (0, decorator_1.Param)('content', 'Str', 'The content of memo.'),
    (0, decorator_1.Param)('label', 'Str', 'The label of memo.'),
    __param(0, decorator_1.Required)
], Mark.prototype, "main", null);
Mark = __decorate([
    (0, decorator_1.Service)('mark')
], Mark);
//# sourceMappingURL=mark.js.map