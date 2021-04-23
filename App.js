import React from 'react'
import { NavigationContainer } from '@react-navigation/native'

import { FirebaseProvider } from './context/FirebaseContext'
import { UserProvider } from './context/UserContext'

import AppStackScreens from './stacks/AppStackScreens'

export default App = () => {
  return (
    <FirebaseProvider>
      <UserProvider>
        <NavigationContainer>
          <AppStackScreens />
        </NavigationContainer>
      </UserProvider>
    </FirebaseProvider>
  )
}
