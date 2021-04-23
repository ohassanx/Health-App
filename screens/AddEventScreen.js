import React, { useContext, useState, useRef } from 'react'
import styled from 'styled-components'
import { Ionicons } from '@expo/vector-icons'

import NumericInput from 'react-native-numeric-input'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import Text from '../components/Text'

import { UserContext } from '../context/UserContext'
import { FirebaseContext } from '../context/FirebaseContext'
import { Alert } from 'react-native'

export default AddEventScreen = ({ navigation }) => {

    const d = new Date()
    d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000)

    const [date, setDate] = useState(d)
    const [visible, setVisible] = useState(false)

    const [moodLevel, setMoodLevel] = useState('')
    const [moodDescription, setMoodDescription] = useState('')
    const [exerciseName, setExerciseName] = useState('')
    const [numberOfReps, setNumberOfReps] = useState(0)
    const [numberOfSets, setNumberOfSets] = useState(0)
    const [exerciseTime, setExerciseTime] = useState('')
    const [weight, setWeight] = useState('')
    const [foodName, setFoodName] = useState('')
    const [calories, setCalories] = useState('')

    const [typeIndex, setTypeIndex] = useState(0)
    const typeList = ['Exercise', 'Diet', 'Mood']
    const [exerciseTypeIndex, setExerciseTypeIndex] = useState(0)
    const exerciseTypeList = ['Weights', 'Cardio']

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)

    const cryingRef = useRef()
    const sadRef = useRef()
    const neutralRef = useRef()
    const happyRef = useRef()
    const lolRef = useRef()
    const heartRef = useRef()
    const loveRef = useRef()

    const assetPath = '../assets'

    const typeChangeHandler = (index) => {
        setTypeIndex((preIndex) => index)
    }

    const exerciseTypeChangeHandler = (index) => {
        setExerciseTypeIndex((preIndex) => index)
    }

    const getToday = () => {
        let d = new Date()
        d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000)
        return d
    }

    const showDatePicker = () => {
        setVisible(true)
    }

    const hideDatePicker = () => {
        setVisible(false)
    }

    const handleConfirm = (date) => {
        date.setTime(date.getTime() - new Date().getTimezoneOffset() * 60 * 1000)
        setDate(date)
        hideDatePicker()
    }

    const handleEmoPress = (targetRef) => {
        const refs = [
            cryingRef,
            sadRef,
            neutralRef,
            happyRef,
            lolRef,
            heartRef,
            loveRef
        ]
        for (let i = 0; i < refs.length; i++) {
            if (refs[i] === targetRef) {
                refs[i].current.setNativeProps({ style: { width: 60, height: 60 } })
                setMoodLevel(i - 2)
            } else {
                refs[i].current.setNativeProps({ style: { width: 40, height: 40 } })
            }
        }
    }

    const clearExercise = () => {
        setExerciseName('')
        setExerciseTypeIndex(0)
        setWeight('')
        setNumberOfSets(0)
        setNumberOfReps(0)
        setExerciseTime('')
    }

    const clearDiet = () => {
        setFoodName('')
        setCalories('')
    }

    const clearMood = () => {
        setMoodLevel('')
        setMoodDescription('')
    }

    const clearFields = () => {
        clearExercise()
        clearDiet()
        clearMood()
        setTypeIndex(0)
        setExerciseTypeIndex(0)
        setDate(getToday())
    }

    const checkExercise = () => {
        if (exerciseName === '' || exerciseName === null) { return ('Please fill in the exercise name') }
        if (exerciseTypeIndex === 0) {
            if (weight === '' || weight === null) { return ('Please fill in the weight') }
            if (numberOfSets === '' || numberOfSets === null) { return ('Please fill in the number of sets') }
            if (numberOfReps === '' || numberOfReps === null) { return ('Please fill in the number of reps') }
        } else {
            if (exerciseTime === '' || exerciseTime === null) { return ('Please fill in the duration of exercise') }
        }
        return null
    }

    const checkDiet = () => {
        if (foodName === '' || foodName === null) { return ('Please fill in the food name') }
        if (calories === '' || calories === null) { return ('Please fill in the calories') }
        return null
    }

    const checkMood = () => {
        if (moodLevel === '' || moodLevel === null) { return ('Please select an emoji') }
        if (moodDescription === '' || moodDescription === null) { return ('Please fill in the description') }
        return null
    }

    const handleSubmit = async () => {
        var exercise = {}
        var diet = {}
        var mood = {}
        var error = false
        if (typeIndex === 0) {
            error = checkExercise()
            exercise = {
                name: exerciseName,
                type: exerciseTypeIndex === 0 ? 'weights' : exerciseTypeIndex === 1 ? 'Cardio' : '',
                weight: weight,
                sets: numberOfSets,
                reps: numberOfReps,
                time: exerciseTime
            }
        } else if (typeIndex === 1) {
            error = checkDiet()
            diet = {
                name: foodName,
                calories: calories
            }
        } else if (typeIndex === 2) {
            error = checkMood()
            mood = {
                level: moodLevel,
                description: moodDescription
            }
        }
        const item = {
            category: typeIndex === 0 ? 'exercise' : typeIndex === 1 ? 'diet' : typeIndex === 2 ? 'mood' : '',
            exercise: exercise,
            diet: diet,
            mood: mood,
            date: date.toISOString(),
        }
        var userInfo = ''
        try {
            userInfo = await firebase.getUserInfo(user.uid)
        } catch (error) {
            console.log('Error with getUserInfo in add event screen: ', error)
        }
        const newArray = []
        for (let i = 0; i < userInfo.items.length; i++) {
            newArray.push(userInfo.items[i])
        }
        newArray.push(item)
        if (error === null) {
            const res = await firebase.updateDB(user.uid, newArray)
            if (res === true) {
                clearFields()
                navigation.navigate('Home')
            } else {
                console.log('An error occured')
            }
        } else {
            Alert.alert(error)
        }

    }

    return (
        <Container>
            <StatusBar hidden='true' />
            <BackButton onPress={() => navigation.goBack()}>
                <Ionicons name='arrow-back' size={24} color='white' />
            </BackButton>
            <Title>
                <Text large center>Add an item</Text>
            </Title>
            <Main>
                <FormTitle>Category:</FormTitle>
                <CheckBoxContainer>
                    {typeList.map((data, index) => (
                        <CheckBox key={data} onPress={typeChangeHandler.bind(this, index)}>
                            <Ionicons name={index === typeIndex ? 'radio-button-on' : 'radio-button-off'} size={12} />
                            <Text small>{data}</Text>
                        </CheckBox>
                    ))}
                </CheckBoxContainer>

                <InputContainer>
                    {typeIndex === 0 ? (
                        <WorkoutContainer>
                            <FormContainer>
                                <FormTitle>Exercise Name</FormTitle>
                                <FormField
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoFocus={true}
                                    placeholder='Swimming / Chest Press'
                                    onChangeText={exerciseName => setExerciseName(exerciseName)}
                                    value={exerciseName}
                                />
                            </FormContainer>
                            <FormContainer>
                                <FormTitle>Type</FormTitle>
                                <CheckBoxContainer>
                                    {exerciseTypeList.map((data, index) => (
                                        <CheckBox key={data} onPress={exerciseTypeChangeHandler.bind(this, index)}>
                                            <Ionicons name={index === exerciseTypeIndex ? 'radio-button-on' : 'radio-button-off'} size={12} />
                                            <Text small>{data}</Text>
                                        </CheckBox>
                                    ))}
                                </CheckBoxContainer>
                            </FormContainer>
                            {exerciseTypeIndex === 0 ? (
                                <WeightContainer>
                                    <FormContainer>
                                        <FormTitle>Weight</FormTitle>
                                        <FormField
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            placeholder='50kg'
                                            onChangeText={weight => setWeight(weight)}
                                            value={weight}
                                        />
                                    </FormContainer>
                                    <FormContainer>
                                        <FormTitle>Sets</FormTitle>
                                        <NumInputWrapper>
                                            <NumericInput
                                                rounded
                                                value={numberOfSets}
                                                onChange={numberOfSets => setNumberOfSets(numberOfSets)}
                                                minValue={0}
                                                maxValue={999}
                                                totalWidth={130}
                                                totalHeight={50}
                                                rightButtonBackgroundColor='#63BEE8'
                                                leftButtonBackgroundColor='#EDBBD0'
                                                iconStyle={{ color: 'white' }}
                                                containerStyle={{ borderRadius: '10px', borderColor: '#EDEBEB' }}
                                                // inputStyle={{ borderColor: 'green' }}
                                                separatorWidth={1}
                                            />
                                        </NumInputWrapper>
                                    </FormContainer>
                                    <FormContainer>
                                        <FormTitle>Reps</FormTitle>
                                        <NumInputWrapper>
                                            <NumericInput
                                                rounded
                                                value={numberOfReps}
                                                onChange={numberOfReps => setNumberOfReps(numberOfReps)}
                                                minValue={0}
                                                maxValue={999}
                                                totalWidth={130}
                                                totalHeight={50}
                                                rightButtonBackgroundColor='#63BEE8'
                                                leftButtonBackgroundColor='#EDBBD0'
                                                iconStyle={{ color: 'white' }}
                                                containerStyle={{ borderRadius: '10px', borderColor: '#EDEBEB' }}
                                                // inputStyle={{ borderColor: 'green' }}
                                                separatorWidth={1}
                                            />
                                        </NumInputWrapper>
                                    </FormContainer>
                                </WeightContainer>
                            ) : exerciseTypeIndex === 1 ? (
                                <CardioContainer>
                                    <FormContainer>
                                        <FormTitle>Duration</FormTitle>
                                        <FormField
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            placeholder='30 mins / 1 hour'
                                            onChangeText={exerciseTime => setExerciseTime(exerciseTime)}
                                            value={exerciseTime}
                                        />
                                    </FormContainer>
                                </CardioContainer>
                            ) : (
                                <ErrorContainer>
                                    <Text>An error occured</Text>
                                </ErrorContainer>
                            )}
                        </WorkoutContainer>
                    ) : typeIndex === 1 ? (
                        <DietContainer>
                            <FormContainer>
                                <FormTitle>Name of food</FormTitle>
                                <FormField
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    autoFocus={true}
                                    placeholder='Banana'
                                    onChangeText={foodName => setFoodName(foodName)}
                                    value={foodName}
                                />
                            </FormContainer>
                            <FormContainer>
                                <FormTitle>Number of calories</FormTitle>
                                <FormField
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholder='600'
                                    onChangeText={calories => setCalories(calories)}
                                    value={calories}
                                />
                            </FormContainer>
                        </DietContainer>
                    ) : typeIndex === 2 ? (
                        <MoodContainer>
                            <LevelContainer>
                                <EmojiContainer
                                    onPress={() => handleEmoPress(cryingRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-crying.png`)}
                                        ref={cryingRef}
                                    />
                                </EmojiContainer>
                                <EmojiContainer onPress={() => handleEmoPress(sadRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-sad.png`)}
                                        ref={sadRef}
                                    />
                                </EmojiContainer>
                                <EmojiContainer onPress={() => handleEmoPress(neutralRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-neutral_emoticon.png`)}
                                        ref={neutralRef}
                                    />
                                </EmojiContainer>
                                <EmojiContainer onPress={() => handleEmoPress(happyRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-happy.png`)}
                                        ref={happyRef}
                                    />
                                </EmojiContainer>
                                <EmojiContainer onPress={() => handleEmoPress(lolRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-lol.png`)}
                                        ref={lolRef}
                                    />
                                </EmojiContainer>
                                <EmojiContainer onPress={() => handleEmoPress(heartRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-smiling_face_with_heart.png`)}
                                        ref={heartRef}
                                    />
                                </EmojiContainer>
                                <EmojiContainer onPress={() => handleEmoPress(loveRef)}>
                                    <Emoji source={require(`${assetPath}/icons8-in_love.png`)}
                                        ref={loveRef}
                                    />
                                </EmojiContainer>
                            </LevelContainer>
                            <FormContainer>
                                <FormTitle>Description</FormTitle>
                                <FormField
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    placeholder='I was very happy today'
                                    onChangeText={moodDescription => setMoodDescription(moodDescription)}
                                    value={moodDescription}
                                />
                            </FormContainer>
                        </MoodContainer>
                    ) : (
                        <ErrorContainer>
                            <Text>An error occured</Text>
                        </ErrorContainer>
                    )}
                    <DateContainer>
                        <FormContainer>
                            <FormTitle>Date</FormTitle>
                            <DateTime onPress={showDatePicker}>
                                <Text>{date.toISOString().substr(0, 10)} {date.toISOString().substr(11, 5)}</Text>
                            </DateTime>
                            <DateTimePickerModal
                                isVisible={visible}
                                mode="datetime"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                                date={date}
                            />
                            {/* <DateTimePicker
                                        value={date}
                                        onChange={(event, selectedDate) => setDate(selectedDate)}
                                        mode='datetime'
                                    /> */}
                            {/* <Text>{date.toISOString()}</Text> */}
                        </FormContainer>
                    </DateContainer>
                </InputContainer>
            </Main>


            <AddButton onPress={handleSubmit}>
                <Text bold center color='white'>Add</Text>
            </AddButton>
        </Container>
    )
}

const Container = styled.View`
    flex: 1
    backgroundColor: white
`
const StatusBar = styled.StatusBar``

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

const Title = styled.View`
    marginTop: 75px
`

const Main = styled.View`
    margin: 30px
    padding: 10px
`

const CheckBoxContainer = styled.View`
    flex-direction: row
`

const CheckBox = styled.TouchableOpacity`
    flexDirection: row
    margin: 10px
    flex: 3
    justifyContent: space-evenly
`

const InputContainer = styled.View`
    marginTop: 20px
    marginBottom: 15px
`

const WorkoutContainer = styled.View`
`

const WeightContainer = styled.View`
`

const CardioContainer = styled.View`
    
`

const DietContainer = styled.View``

const MoodContainer = styled.View``

const ErrorContainer = styled.View``

const DateContainer = styled.View`
`

const LevelContainer = styled.View`
    flex-direction: row
    justify-content: center
    align-items: center
    padding: 10px
`

const NumInputWrapper = styled.View`
    justify-content: center
    align-items: center
`

const FormContainer = styled.View`
    padding: 10px
`

const FormTitle = styled(Text)`
    marginBottom: 5px
`

const FormField = styled.TextInput`
    borderBottomColor: #4267B2
    borderBottomWidth: 0.5px
`

const EmojiContainer = styled.TouchableOpacity``

const Emoji = styled.Image`
    width: 40px
    height: 40px
`

const DateTime = styled.TouchableOpacity`
    justify-content: center
    align-items: center
    padding: 5px
`

const AddButton = styled.TouchableOpacity`
    margin: 0px 48px
    height: 48px
    align-items: center
    justify-content: center
    backgroundColor: hotpink
    borderRadius: 15px
`

