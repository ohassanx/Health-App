import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import LottieView from 'lottie-react-native'

import Text from '../components/Text'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FirebaseContext'

export default LoadingScreen = () => {

    const [_, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        setTimeout(async () => {
            const user = await firebase.getCurrentUser()

            if (user) {
                var userInfo = ''
                try {
                    userInfo = await firebase.getUserInfo(user.uid)
                } catch (error) {
                    console.log('Error with getting user info in loading screen: ', error)
                }
                setUser({
                    isLoggedIn: true,
                    email: userInfo.email,
                    uid: user.uid,
                    username: userInfo.username,
                    profilePicUrl: userInfo.profilePicUrl
                })
            } else {
                setUser(state => ({ ...state, isLoggedIn: false }))
            }
        }, 600)
    }, [])

    return (
        <Container>
            <Text title>Optimal</Text>
            <LottieView
                source={require('../assets/loading-1.json')}
                autoPlay
                style={{ width: '100%' }}
            />
        </Container>
    )
}

const Container = styled.View`
    flex: 1
    justify-content: center
    align-items: center
`

