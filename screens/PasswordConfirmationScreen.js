import React from 'react'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons'
import Text from '../components/Text'


export default PasswordResetScreen = ({ navigation }) => {
    return (
        <Container>
            <HomeButton onPress={() => navigation.navigate('Login')}>
                <Ionicons name='home' size={24} color='white' />
            </HomeButton>
            <Text center small bold>Please check your email to reset your password!</Text>
        </Container>
    )
}

const Container = styled.View`
    flex: 1
    justifyContent: center
    alignItems: center
`

const HomeButton = styled.TouchableOpacity`
    position: absolute
    top: 48px
    left: 32px
    width: 32px
    height: 32px
    borderRadius: 16px
    backgroundColor: rgba(21,22,48,0.1)
    alignItems: center
    justifyContent: center
`
