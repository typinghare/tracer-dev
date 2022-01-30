"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Null = exports.Obj = exports.List = exports.Bool = exports.Str = exports.Float = exports.Int = exports.Struct = exports.Scalar = exports.Any = void 0;
class Any {
    static parse(literal) {
        return new Int();
    }
    is(type) {
        return this instanceof type;
    }
    get type() {
        return this.constructor.name.toLowerCase();
    }
}
exports.Any = Any;
class Scalar extends Any {
}
exports.Scalar = Scalar;
class Struct extends Any {
}
exports.Struct = Struct;
class Int extends Scalar {
    get value() {
        return 0;
    }
}
exports.Int = Int;
class Float extends Scalar {
    get value() {
        return 0.0;
    }
}
exports.Float = Float;
class Str extends Scalar {
    get value() {
        return '';
    }
}
exports.Str = Str;
class Bool extends Scalar {
    get value() {
        return false;
    }
}
exports.Bool = Bool;
class List extends Struct {
    get value() {
        return [];
    }
}
exports.List = List;
class Obj extends Struct {
    get value() {
        return {};
    }
}
exports.Obj = Obj;
class Null extends Any {
    get value() {
        return null;
    }
}
exports.Null = Null;
class Type {
}
exports.Type = Type;
//# sourceMappingURL=type.js.map