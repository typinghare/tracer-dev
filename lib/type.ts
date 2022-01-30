type ParseFunction = (literal: string) => Any | undefined;

export class TypeParser {
  private _parseFunctionList: Array<ParseFunction> = [];

  public constructor() {
    // parse bool
    this._parseFunctionList.push((literal: string) => {
      if (literal == 'true') return new Bool(true);
      if (literal == 'false') return new Bool(false);
    });

    // parse int
    this._parseFunctionList.push((literal: string) => {
      const match = literal.match(/^-?[1-9][0-9]*$/);
      if (match !== null) return new Int(parseInt(literal));
    });

    // parse float
    this._parseFunctionList.push((literal: string) => {
      const match = literal.match(/^-?([0-9]|[1-9][0-9]*).[0-9]*$/);
      if (match !== null) return new Float(parseFloat(literal));
    });

    // parse string
    this._parseFunctionList.push((literal: string) => {
      const c = literal[0];
      if (c != '[' && c != '{') return new Str(literal);
    });

    // parse list
    this._parseFunctionList.push((literal: string) => {
      if (literal[0] != '[') return;
      const literalList: Array<string> = literal.split(/,/).map(String.prototype.trim);
      const list: Array<Any> = literalList.map(literal => this.parse(literal));
      return new List(list);
    });

    // parse obj
    this._parseFunctionList.push((literal: string) => {
      if (literal[0] != '{') return;
      return new Obj(new Map());
    });
  }

  public parse(literal: string): Any {
    literal = literal.trim();
    for (const parseFunction of this._parseFunctionList) {
      const ret = parseFunction(literal);
      if (ret !== undefined) return ret;
    }

    return new Null();
  }
}

export abstract class Any {
  private static typeParser: TypeParser = new TypeParser();

  public static parse(literal: string): Any {
    return Any.typeParser.parse(literal);
  }

  public is(type: Function): boolean {
    return this instanceof type;
  }

  public get type(): string {
    return this.constructor.name.toLowerCase();
  }

  public abstract get value(): any;
}

export abstract class Scalar extends Any {
}

export abstract class Struct extends Any {
}

export class Int extends Scalar {
  private readonly _value: number;

  public constructor(value: number) {
    super();
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}

export class Float extends Scalar {
  private readonly _value: number;

  public constructor(value: number) {
    super();
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}

export class Str extends Scalar {
  private readonly _value: string;

  public constructor(value: string) {
    super();
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}

export class Bool extends Scalar {
  private readonly _value: boolean;

  public constructor(value: boolean) {
    super();
    this._value = value;
  }

  get value(): boolean {
    return this._value;
  }
}

export class List<T extends Any> extends Struct {
  private readonly _value: Array<Any>;

  public constructor(value: Array<Any>) {
    super();
    this._value = value;
  }

  get value(): Array<Any> {
    return this._value;
  }
}

export class Obj<K extends Scalar, V extends Any> extends Struct {
  private readonly _value: Map<K, V>;

  public constructor(value: Map<K, V>) {
    super();
    this._value = value;
  }

  get value(): Map<K, V> {
    return this._value;
  }
}

export class Null extends Any {
  get value(): any {
    return null;
  }
}