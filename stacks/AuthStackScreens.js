import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import RegisterScreen from '../screens/RegisterScreen'
import LoginScreen from '../screens/LoginScreen'
import PasswordResetScreen from '../screens/PasswordResetScreen'
import PasswordConfirmationScreen from '../screens/PasswordConfirmationScreen'

export default AuthStackScreens = () => {
    const AuthStack = createStackNavigator()

    return (
        <AuthStack.Navigator headerMode='none'>
            <AuthStack.Screen name='Register' component={RegisterScreen} />
            <AuthStack.Screen name='Login' component={LoginScreen} />
            <AuthStack.Screen name='PReset' component={PasswordResetScreen} />
            <AuthStack.Screen name='PConfirmation' component={PasswordConfirmationScreen} />
        </AuthStack.Navigator>
    )
}