import React, { useContext } from 'react'
import styled from 'styled-components'

import Text from '../components/Text'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FirebaseContext'

import Pedometer from '../components/Pedometer'


export default ProfileScreen = () => {

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const logOut = async () => {
        const isLoggedOut = await firebase.logOut()

        if (isLoggedOut) {
            setUser(state => ({ ...state, isLoggedIn: false }))
        }
    }

    return (
        <Container>
            <Details>
                <ProfilePicContainer>
                    <ProfilePic source={user.profilePicUrl === 'default' ? require('../assets/defaultProfilePic.jpg') : { uri: user.profilePicUrl }} />
                </ProfilePicContainer>
                <Text medium bold margin='16px 0 32px 0'>{user.username}</Text>
                <HealthContainer>
                    <Text margin='0 8px 0 8px'>Height: 180cm</Text>
                    <Text margin='0 8px 0 8px'>Weight: 50kg</Text>
                    <Text margin='0 8px 0 8px'>BMI: 18.5</Text>
                </HealthContainer>
                <PedoContainer>
                    <Pedometer />
                </PedoContainer>
            </Details>
            <Logout onPress={logOut}>
                <Text bold center color='white'>Logout</Text>
            </Logout>
        </Container>
    )
}

const Container = styled.View`
    flex: 1
`

const Details = styled.View`
    margin: 100px 30px 30px
    justifyContent: center
    alignItems: center
`

const ProfilePicContainer = styled.View`
    shadow-opacity: 0.9
    shadow-radius: 32px
    shadow-color: grey
`

const ProfilePic = styled.Image`
    width: 128px
    height: 128px
    border-radius: 64px
`

const HealthContainer = styled.View`
    flexDirection: row
`

const PedoContainer = styled.View`
    marginTop: 32px
`

const Logout = styled.TouchableOpacity`
    margin: 256px 48px
    height: 48px
    align-items: center
    justify-content: center
    backgroundColor: hotpink
    borderRadius: 15px
`


