import fs from 'fs'
import { logr } from './helpers/utils'

const defaultSettings = {
    "passwordLength": 20,
    "includeUpperCase": true,
    "includeLowerCase": true,
    "includeNumbers": true,
    "includeSymbols": true,
    "autoCopyToClipboard": true,
    "configHeaderText": "Password Generator Settings"
}

const settingsJsonPath = `${__dirname}/config/`
const settingsJsonFileName = `settings.json`
const settingsJsonFilePath = settingsJsonPath + settingsJsonFileName

let settingsData

try {
    const settingsDataRaw = fs.readFileSync(settingsJsonFilePath, 'utf8')
    settingsData = {
        ...defaultSettings,
        ...JSON.parse(settingsDataRaw)
    }
}
catch (err) {
    if(err.code === 'ENOENT') {
        if(!fs.existsSync(settingsJsonPath)) {
            fs.mkdirSync(settingsJsonPath)
            fs.writeFileSync(settingsJsonFilePath, JSON.stringify(defaultSettings), {flag: "w"})
        }
        settingsData = defaultSettings
    }
}

const alpha = "abcdefghijklmnopqrstuvwxyz"
const digits = "0123456789"
const allSymbols = "!#$%^&*=<>."

export const settingsAlias = {
    "length": "passwordLength",
    "upper": "includeUpper",
    "lower": "includeLower",
    "numbers": "includeNumbers",
    "symbols": "includeSymbols",
    "auto-copy": "autoCopyToClipboard",
    "header-text": "configHeaderText"
}

export const appSettings = {
    configurableSettings: settingsData,
    upperCase: alpha.split("").map((l: string) => l.toUpperCase()),
    lowerCase: alpha.split(""),
    numbers: digits.split(""),
    symbols: allSymbols.split("")
}