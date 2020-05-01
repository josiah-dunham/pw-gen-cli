import { getRandomInteger, getRandomElelmentFromArray, logr } from './helpers/utils'
import { OPTIONS } from './helpers/types'
import { appSettings } from './settings'

const { upperCase, lowerCase, numbers, symbols, configurableSettings } = appSettings
const { passwordLength, includeUpperCase, includeLowerCase, includeNumbers, includeSymbols, autoCopyToClipboard} = configurableSettings

const options = {
    c: passwordLength,
    u: includeUpperCase,
    l: includeLowerCase,
    n: includeNumbers,
    s: includeSymbols,
    a: autoCopyToClipboard
}

const validInputFlags = Object.keys(options).filter((f: string) => f !== "c")

export const setOptions = (args: string[]) => {
    for (let a = 0; a < args.length; a++) {
        const char1 = args[a].substr(0, 1)
        const isFlag = char1 === "-" ? true : false
        if (isFlag) {
            validInputFlags.map((f: string) => options[f] = false)
            const currentFlag = args[a].substr(1, args[a].length)
            currentFlag.split("").map((f: string) => options[f] = true)
        }
        else {
            if (!isNaN(+args[a])) {
                options.c = +args[a]
            }
        }
    }

    return options
}

const getRandomCharacter = (option: OPTIONS) => () => (option === 0
    ? getRandomElelmentFromArray(upperCase)
    : option === 1 ? getRandomElelmentFromArray(lowerCase)
        : option === 2 ? getRandomElelmentFromArray(numbers)
            : getRandomElelmentFromArray(symbols)
)

const flagsToMethodMap = {
    u: getRandomCharacter(OPTIONS.UPPER),
    l: getRandomCharacter(OPTIONS.LOWER),
    n: getRandomCharacter(OPTIONS.DIGIT),
    s: getRandomCharacter(OPTIONS.SYMBOL),
}

export const generatePassword = (options: any) => {
    const allSetFlags = validInputFlags.filter((f: string) => options[f])

    const callableFlags: string[] = []
    const otherFlags: string[] = []

    const validFlags = {
        callableFlags,
        otherFlags
    }

    for(let f = 0; f < allSetFlags.length; f++) {
        const flag = allSetFlags[f]
        const callable = Object.keys(flagsToMethodMap).find((m: string) => flag === m)

        callable ? validFlags.callableFlags.push(flag) : validFlags.otherFlags.push(flag)
    }

    if(validFlags.callableFlags.length === 0) {
        validFlags.callableFlags = Object.keys(flagsToMethodMap)
    }

    const methodsToUse = validFlags.callableFlags.map((f: string) => flagsToMethodMap[f])

    let pw: string[] = []

    for (let c = 0; c < options.c; c++) {
        const randomMethodIndex = getRandomInteger(validFlags.callableFlags.length)
        const fnToCall = methodsToUse[randomMethodIndex]
        const pwChar = fnToCall()
        pw.push(pwChar)
    }
    return pw
}