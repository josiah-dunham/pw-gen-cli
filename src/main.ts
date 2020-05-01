#! /usr/bin/env node

import os from 'os'
import fs from 'fs'
import { exec } from 'child_process'

import { setOptions, generatePassword } from './generate-password'
import { settingsAlias, appSettings } from './settings'
import { logr } from './helpers/utils'
import DisplayConfig from './display-config'

const [, , ...args] = process.argv
const platform = os.platform()

const settingsJsonFilePath = `${__dirname}/config/settings.json`

if (args[0] === "--config") {
    if (args[1]) {
        if (args[1] === "show") {
            const displayConfig = DisplayConfig()
            // const displayConfig = DisplayConfig({header: "PW Gen"})
            // const displayConfig = DisplayConfig({header: "Password Generator Is The Best Generator In The World"})
            displayConfig.showConfig()
        }
        else {
            const configOptions = args.slice(1, args.length).filter((c: string) => Object.keys(settingsAlias).find((s: string) => s === c.split("=")[0]))
            const configOptionsLength = configOptions.length

            let newConfig = { ...appSettings.configurableSettings }

            for (let c = 0; c < configOptionsLength; c++) {
                const optionKeyVal = configOptions[c].split("=")
                if (optionKeyVal.length !== 2) {
                    continue
                }

                newConfig[settingsAlias[optionKeyVal[0]]] =
                    optionKeyVal[1] === "false" ? false
                        : optionKeyVal[1] === "true" ? true
                            : !isNaN(+optionKeyVal[1]) ? +optionKeyVal[1]
                                : optionKeyVal[1]
            }

            try{
                fs.writeFileSync(settingsJsonFilePath, JSON.stringify(newConfig))
            }
            catch(err) {
                logr('err')
                logr(err)
            }
        }
    }
    else {
        // invalid config flags
        logr("error: config params are required")
    }
}
else {
    logr()
    logr("Generating new password...")
    const options = setOptions(args)

    const pw = generatePassword(options).join("")

    logr(`Complete! New random password generated: ${pw}`)
    if(options.a) {
        logr()

        if (platform === 'darwin') {
            exec(`echo ${pw} | pbcopy`, (err: any) => {
                if (err) {
                    logr("Error: an error occurred while copying password to clipboard")
                    logr(err)
                }
                else {
                    logr("Password has been copied to clipboard!")
                }
            })
        }
    }
}


