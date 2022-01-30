"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scan_1 = require("./scan");
const path = require("path");
const loader = scan_1.Scan.loader;
loader.scan(path.join(__dirname, '../app'));
console.log(loader.servantManager.getServant('memo').getService('find'));
//# sourceMappingURL=index.js.map