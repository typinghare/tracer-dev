"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Null = exports.Obj = exports.List = exports.Bool = exports.Str = exports.Float = exports.Int = exports.Struct = exports.Scalar = exports.Any = exports.TypeParser = void 0;
class TypeParser {
    constructor() {
        this._parseFunctionList = [];
        this._parseFunctionList.push((literal) => {
            if (literal == 'true')
                return new Bool(true);
            if (literal == 'false')
                return new Bool(false);
        });
        this._parseFunctionList.push((literal) => {
            const match = literal.match(/^-?[1-9][0-9]*$/);
            if (match !== null)
                return new Int(parseInt(literal));
        });
        this._parseFunctionList.push((literal) => {
            const match = literal.match(/^-?([0-9]|[1-9][0-9]*).[0-9]*$/);
            if (match !== null)
                return new Float(parseFloat(literal));
        });
        this._parseFunctionList.push((literal) => {
            const c = literal[0];
            if (c != '[' && c != '{')
                return new Str(literal);
        });
        this._parseFunctionList.push((literal) => {
            if (literal[0] != '[')
                return;
            const literalList = literal.split(/,/);
            const list = literalList.map(literal => this.parse(literal));
            return new List(list);
        });
        this._parseFunctionList.push((literal) => {
            if (literal[0] != '{')
                return;
            return new Obj(new Map());
        });
    }
    parse(literal) {
        literal = literal.trim();
        for (const parseFunction of this._parseFunctionList) {
            const ret = parseFunction(literal);
            if (ret !== undefined)
                return ret;
        }
        return new Null();
    }
}
exports.TypeParser = TypeParser;
class Any {
    static parse(literal) {
        return Any.typeParser.parse(literal);
    }
    is(type) {
        return this instanceof type;
    }
    get type() {
        return this.constructor.name.toLowerCase();
    }
}
exports.Any = Any;
Any.typeParser = new TypeParser();
class Scalar extends Any {
}
exports.Scalar = Scalar;
class Struct extends Any {
}
exports.Struct = Struct;
class Int extends Scalar {
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.Int = Int;
class Float extends Scalar {
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.Float = Float;
class Str extends Scalar {
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.Str = Str;
class Bool extends Scalar {
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.Bool = Bool;
class List extends Struct {
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.List = List;
class Obj extends Struct {
    constructor(value) {
        super();
        this._value = value;
    }
    get value() {
        return this._value;
    }
}
exports.Obj = Obj;
class Null extends Any {
    get value() {
        return null;
    }
}
exports.Null = Null;
//# sourceMappingURL=type.js.map