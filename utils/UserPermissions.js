import * as Permissions from 'expo-permissions'
import { Platform } from 'react-native'

class UserPermissions {
    getCameraPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)

            if (status != 'granted') {
                alert('We need your permission to use your camera!')
            }
        }
    }

    getCalendarPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.CALENDAR)

            if (status != 'granted') {
                alert('We need your permission to use your calendar!')
            }
        }
    }

    getRemindersPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await Permissions.askAsync(Permissions.REMINDERS)

            if (status != 'granted') {
                alert('We need your permission to use your reminders!')
            }
        }
    }
}

export default new UserPermissions()