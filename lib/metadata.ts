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