import { Scan } from './scan';
import 'reflect-metadata';

type Key = string | symbol;

export module Metadata {
  /**
   * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
   * @param key metadata key
   * @param target
   * @param propertyKey
   */
  export function get(key: Key, target: Object, propertyKey?: Key) {
    return propertyKey ?
      Reflect.getMetadata(key, target, propertyKey) :
      Reflect.getMetadata(key, target);
  }

  /**
   * Define a unique metadata entry on the target.
   * @param key metadata key
   * @param value
   * @param target
   * @param propertyKey
   */
  export function set(key: Key, value: any, target: Object, propertyKey?: Key) {
    propertyKey
      ? Reflect.defineMetadata(key, value, target, propertyKey)
      : Reflect.defineMetadata(key, value, target);
  }

  /**
   * Deletes the metadata entry from the target object with the provided key.
   * @param key
   * @param value
   * @param target
   * @param propertyKey
   */
  export function remove(key: Key, value: any, target: Object, propertyKey?: Key) {
    propertyKey ?
      Reflect.deleteMetadata(key, target, propertyKey) :
      Reflect.deleteMetadata(key, target);
  }

  /**
   * Push a value to a metadata list. Automatically create list if metadata not found.
   * @param key metadata key
   * @param value
   * @param target
   * @param propertyKey
   */
  export function push(key: Key, value: any, target: Object, propertyKey?: Key) {
    const list = get(key, target, propertyKey) || [];
    if (!Array.isArray(list)) return;
    list.push(value);
    set(key, list, target, propertyKey);
  }
}

export module Metadata2 {
  class ClassMetadata {
    private readonly _constructor: Function;

    public constructor(target: Object) {
      this._constructor = typeof target == 'function' ? target : target.constructor;
    }

    public get(key: Key): any {
      return Reflect.getMetadata(key, this._constructor);
    }

    public set(key: Key, value: any) {
      Reflect.defineMetadata(key, value, this._constructor);
    }

    public method(methodName: string): MethodMetaData {
      return new MethodMetaData(this._constructor, methodName);
    }

    public getProperty(property: string, key: Key): any {
      Reflect.getMetadata(key, this._constructor, property);
    }

    public setProperty(property: string, key: Key, value: any) {
      Reflect.defineMetadata(key, value, this._constructor, property);
    }
  }

  class MethodMetaData {
    private static readonly _SYMBOL: symbol = Symbol('param');

    private readonly _constructor: Function;
    private readonly _methodName: string;

    public constructor(target: Function, methodName: string) {
      this._constructor = target;
      this._methodName = methodName;
    }

    public get(key: Key): any {
      return Reflect.getMetadata(key, this._constructor, this._methodName);
    }

    public set(key: Key, value: any) {
      Reflect.defineMetadata(key, value, this._constructor, this._methodName);
    }

    public setParam(index: number, key: string, value: string) {
      const paramList = Reflect.getMetadata(MethodMetaData._SYMBOL, this._constructor, this._methodName) || [];
      const param = paramList[index] || {};
      param[key] = value;
      paramList[index] = param;
      Reflect.defineMetadata(MethodMetaData._SYMBOL, this._constructor, this._methodName);
    }

    public getParamList(): Array<object> {
      return Reflect.getMetadata(MethodMetaData._SYMBOL, this._constructor, this._methodName) || [];
    }

    public getParam(index: number): object {
      return this.getParamList()[index];
    }
  }

  export function of(constructor: Object) {
    return new ClassMetadata(constructor);
  }
}

/**
 * Class decorator.
 * To declare a tracer service class.
 * @param serviceName service name of class
 */
export function Service(
  serviceName: string
): <T extends { new(...args: any[]): {} }>(constructor: T) => void {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    // register service to its servant
    Scan.loader.registerService(serviceName);
    Scan.loader.saveServiceConstructor(constructor);
  };
}

/**
 * Method decorator.
 */
export function Execute(): (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => void {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Metadata set execute function
    Metadata.set('ExecuteFunction', descriptor.value, target.constructor);
    Metadata2.of(target).method(target).set('ExecuteFunction', descriptor.value);
  };
}

/**
 * Method decorator.
 */
export function Return(
  type: string | string[],
  intro: string
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return function(target: any, propertyKey: string) {
    Metadata.set('returnIntro', intro, target.constructor, propertyKey);
    Metadata.set('returnType', type, target.constructor, propertyKey);
  };
}

/**
 * Method decorator.
 */
export function Option(
  long: string,
  short?: string
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const option = new Scan.Option(long, short);
    option.executeFunction = descriptor.value;
    Metadata.push('optionList', option, target.constructor);
  };
}

/**
 * Method decorator.
 * To declare an option method.
 * @param name the name of param must be consistent with the name of formal parameter
 * @param type probable types of the parameter
 * @param intro introduction of the parameter
 */
export function Param(
  name: string,
  type: string | string[],
  intro?: string
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return function(target: any, propertyKey: string) {
    const param = new Scan.Param(name);
    param.intro = intro;
    param.typeList = Array.isArray(type) ? type : [type];
    Metadata.push('paramList', param, target.constructor, propertyKey);
  };
}

/**
 * Property decorator.
 * To declare whether a parameter is required.
 */
export function Required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
): void {
  Metadata.push('requiredParamIndexList', parameterIndex, target.constructor, propertyKey);
}

export type CompletionInfo = [string, string, Function];

/**
 * Method decorator.
 * To declare a completion method.
 * @constructor
 */
export function Completion(
  paramName: string,
  optionName?: string
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const info: CompletionInfo = [paramName, optionName, descriptor.value];
    Metadata.set('completion', info, target.constructor, propertyKey);
  };
}