"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamNameList = void 0;
function getParamNameList(func) {
    const str = func.toString().trim();
    const match = str.match(/^.*\((.*)\)[^{]*{/);
    if (match == null)
        return [];
    return match[1].split(',').map(s => s.trim());
}
exports.getParamNameList = getParamNameList;
//# sourceMappingURL=misc.js.map