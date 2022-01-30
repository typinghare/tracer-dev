import { Scan } from './scan';
import { Metadata } from './metadata';

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