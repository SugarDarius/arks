
export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';
export const isNil = (obj: any): obj is null | undefined => typeof obj === 'undefined' || obj === null;

export const isNumber = (obj: any): obj is number => typeof obj === 'number';
export const isString = (obj: any): obj is string => typeof obj === 'string';
export const isBoolean = (obj: any): obj is boolean => typeof obj === 'boolean';

export const isObject = (obj: any): obj is object => typeof obj === 'object';
export const isFunction = (obj: any): obj is Function => typeof obj === 'function';

export const isArray = (obj: any): obj is Array<any> => obj instanceof Array;