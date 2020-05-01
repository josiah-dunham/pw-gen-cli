export const logr = console.log

export const toRawType = (value: any) => Object.prototype.toString.call(value).slice(8, -1)

const getRawType = (d: string) => (v: any) => d === toRawType(v)

const isObject = getRawType("Object")
const isArray = getRawType("Array")
const isNumber = getRawType("Number")
const isString = getRawType("String")
const isBoolean = getRawType("Boolean")
const isNull = getRawType("Null")
const isUndefined = getRawType("Undefined")

const hasValue = (v: any) => !(isNull(v) || isUndefined(v))

export const typeChecks = {
    isObject,
    isArray,
    isNumber,
    isString,
    isBoolean,
    isNull,
    isUndefined,
    hasValue
}

export const getRandomInteger = (max: number, min = 0) => Math.floor(Math.random() * (max - min)) + min

export const getRandomElelmentFromArray = (items: string[]) => items[getRandomInteger(items.length)]