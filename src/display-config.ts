import { appSettings } from './settings'
import { logr, typeChecks } from './helpers/utils'

interface IDisplayConfig {
    header?: string
}

const DisplayConfig = () => {
    const { configurableSettings } = appSettings

    const { configHeaderText } = appSettings.configurableSettings

    const headerLength = configHeaderText.length

    const sideSpacingLength = 7

    const appSettingKeys = Object.keys(configurableSettings)
    const appSettingKeysToDisplay = appSettingKeys.filter((k: string) => k !== "configHeaderText")
    const maxKeyLength = Math.max(...appSettingKeysToDisplay.map((s: string) => s.length))
    const maxValueLength = Math.max(...appSettingKeysToDisplay.map((s: string) => configurableSettings[s].toString().length))

    const headerRowLength = headerLength + (sideSpacingLength * 2)
    const minRequiredRowLength = (maxKeyLength + (sideSpacingLength * 2)) + (maxValueLength + (sideSpacingLength * 2)) + 1

    const lineLength = headerRowLength >= minRequiredRowLength ? headerRowLength : minRequiredRowLength

    const appSettingCount = appSettingKeysToDisplay.length
    
    const col1Size = maxKeyLength + (sideSpacingLength * 2)
    const col2Size = lineLength - col1Size

    const displayHeader = () => {
        logr()
        const headerTopBottomBorder = "=".repeat(lineLength)
        const sideSpacesNeeded = lineLength - headerLength
        const addExtraSpaceToRight = sideSpacesNeeded % 2 !== 0
        const eachSideSpaces = Math.floor(sideSpacesNeeded / 2)

        const leftSideSpacing = " ".repeat(eachSideSpaces)
        const rightSideSpacing = addExtraSpaceToRight ? " ".repeat(eachSideSpaces + 1) : leftSideSpacing
        
        let header = `+${headerTopBottomBorder}+\n`
        header += `|${leftSideSpacing}${configHeaderText}${rightSideSpacing}|\n`
        header += `+${headerTopBottomBorder}+`
        logr(header)
    }
    const displayBody = () => {
        const lineBorder = "-".repeat(lineLength)
        for (let s = 0; s < appSettingCount; s++) {
            const currentSetting = appSettingKeysToDisplay[s]
            const currentSettingValue = configurableSettings[appSettingKeysToDisplay[s]]

            if (typeChecks.isArray(currentSettingValue)) {
                logr(`${currentSetting}:`)
                logr(currentSettingValue)
            }
            else { 
                const columnOutsideSpaces = " ".repeat(sideSpacingLength)

                const spacesToAddCol1 = col1Size - currentSetting.length - sideSpacingLength // 4
                const col1ExtraSpaces = " ".repeat(spacesToAddCol1)
                
                const valueLength = currentSettingValue.toString().length
                const spacesToAddCol2 = col2Size - (valueLength + sideSpacingLength + 1)
                const col2ExtraSpaces = " ".repeat(spacesToAddCol2)

                let line = `|${columnOutsideSpaces}${currentSetting}${col1ExtraSpaces}|${col2ExtraSpaces}${currentSettingValue}${columnOutsideSpaces}|`

                if(s !== 0) {
                    line = `|${lineBorder}|\n${line}`
                }
                logr(line)
            }
        }
    }

    const displayFooter = () => logr(`+${"=".repeat(lineLength)}+\n`)

    const showConfig = () => {
        displayHeader()
        displayBody()
        displayFooter()
    }

    return {
        showConfig
    }
}

export default DisplayConfig