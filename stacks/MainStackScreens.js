import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from '../screens/HomeScreen'
import ProgressionScreen from '../screens/ProgressionScreen'
import AddEventScreen from '../screens/AddEventScreen'
import BookingScreen from '../screens/BookingScreen'
import ProfileScreen from '../screens/ProfileScreen'

export default MainStackScreens = () => {
    const MainStack = createBottomTabNavigator()

    const tabBarOptions = {
        showLabel: false,
        style: {
            backgroundColor: 'black',
            paddingBottom: 12
        }
    }

    const screenOptions = (({ route }) => ({
        tabBarIcon: ({ focused }) => {
            let iconName = 'home'

            switch (route.name) {
                case 'Home':
                    iconName = 'home'
                    break

                case 'Graphs':
                    iconName = 'bar-chart'
                    break

                case 'Booking':
                    iconName = 'calendar'
                    break

                case 'Profile':
                    iconName = 'person'
                    break

                default:
                    iconName = 'home'
            }

            if (route.name === 'Add') {
                return <Ionicons name='add-circle' size={64} color='hotpink' />
            }

            return <Ionicons name={iconName} size={25} color={focused ? 'white' : 'skyblue'} />
        }
    }))

    return (
        <MainStack.Navigator tabBarOptions={tabBarOptions} screenOptions={screenOptions}>
            <MainStack.Screen name='Home' component={HomeScreen} />
            <MainStack.Screen name='Graphs' component={ProgressionScreen} />
            <MainStack.Screen name='Add' component={AddEventScreen} options={{ tabBarVisible: false }} />
            <MainStack.Screen name='Booking' component={BookingScreen} />
            <MainStack.Screen name='Profile' component={ProfileScreen} />
        </MainStack.Navigator>
    )
}
