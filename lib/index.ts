import { Scan } from './scan';
import * as path from 'path';

const loader = Scan.loader;
loader.scan(path.join(__dirname, '../app'));
console.log(loader.servantManager.getServant('memo').getService('find'));