import React, { useState, useContext } from 'react'
import styled from 'styled-components'

import { Ionicons } from '@expo/vector-icons'

import Text from '../components/Text'

import { FirebaseContext } from '../context/FirebaseContext'
import { Alert } from 'react-native'

export default PasswordResetScreen = ({ navigation }) => {

    const [email, setEmail] = useState()
    const [loading, setLoading] = useState(false)

    const firebase = useContext(FirebaseContext)

    const resetPassword = async () => {
        setLoading(true)
        try {
            await firebase.resetPassword(email)
            navigation.navigate('PConfirmation')
        } catch (error) {
            error.code === 'auth/invalid-email' ? Alert.alert('Invalid email')
                : error.code === 'auth/user-not-found' ? Alert.alert('There is no user with that email')
                    : Alert.alert('Please fill in your email')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container>
            <BackButton onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={24} color='white' />
            </BackButton>
            <Main>
                <Text center bold>Enter your email to reset your password</Text>
                <FormContainer>
                    <FormTitle>Email</FormTitle>
                    <FormField
                        autoCapitalize='none'
                        autoCompleteType='email'
                        autoCorrect={false}
                        autoFocus={true}
                        keyboardType='email-address'
                        onChangeText={email => setEmail(email.trim())}
                        value={email}
                    />
                </FormContainer>
            </Main>
            <ResetContainer onPress={resetPassword} disabled={loading}>
                {loading ? (
                    <Loading />
                ) : (
                    <Text bold center color='white'>Reset Password</Text>
                )}
            </ResetContainer>
        </Container>
    )
}

const Container = styled.View`
    flex: 1
`

const BackButton = styled.TouchableOpacity`
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

const Main = styled.View`
margin: 256px 32px 32px
`

const FormContainer = styled.View`
    marginBottom: 32px
    marginTop: 64px
`

const FormTitle = styled(Text)`
    color: #8A8F9E
    font-size: 14px
    text-transform: uppercase
    font-weight: 300
`

const FormField = styled.TextInput`
    borderBottomColor: #4267B2
    borderBottomWidth: 0.5px
    height: 48px
`

const ResetContainer = styled.TouchableOpacity`
    margin: 0px 48px
    height: 48px
    align-items: center
    justify-content: center
    backgroundColor: hotpink
    borderRadius: 15px
`

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: 'white',
    size: 'small'
}))``
