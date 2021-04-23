import React, { useState, useContext, useEffect } from 'react'
import { Alert, StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons'

import { FirebaseContext } from '../context/FirebaseContext';
import { UserContext } from '../context/UserContext';


export default HomeScreen = ({ navigation }) => {
    const [items, setItems] = useState({})
    const [today, setToday] = useState('')

    const [user, setUser] = useContext(UserContext)
    const firebase = useContext(FirebaseContext)


    useEffect(() => {
        const focused = navigation.addListener('focus', () => {
            getToday()
            loadItems()
        })
    }, [navigation])

    const getToday = () => {
        let date = new Date()
        let now = DateToString(date)
        setToday(now)
    }

    const sort = (items) => {
        if (items.length <= 1) {
            return
        }
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < (items.length - i - 1); j++) {
                if (items[j].time > items[j + 1].time) {
                    let tmp = items[j]
                    items[j] = items[j + 1]
                    items[j + 1] = tmp
                }
            }
        }
    }

    const handleItem = () => {
        Alert.alert('Feature coming soon')
    }

    const loadItems = async () => {
        setTimeout(() => { }, 1000)
        var userInfo = ''
        try {
            userInfo = await firebase.getUserInfo(user.uid)
        } catch (error) {
            console.log('Error with getUserInfo in home screen: ', error)
        }

        for (let i = 0; i < userInfo.items.length; i++) {
            const string = userInfo.items[i].date
            const date = string.substr(0, 10)
            if (items[date]) {
                items[date] = null
            }
        }

        var dates = []

        for (let i = 0; i < userInfo.items.length; i++) {
            const string = userInfo.items[i].date
            const date = string.substr(0, 10)
            const time = string.substr(11, 5)

            if (!items[date]) {
                items[date] = []
                dates.push(date)
            }

            if (userInfo.items[i].category === 'exercise') {
                if (userInfo.items[i].exercise.type === 'weights') {
                    items[date].push({
                        name: userInfo.items[i].exercise.name,
                        weight: userInfo.items[i].exercise.weight,
                        sets: userInfo.items[i].exercise.sets,
                        reps: userInfo.items[i].exercise.reps,
                        time: time,
                        type: 'exercise',
                        height: 120
                    })
                } else {
                    items[date].push({
                        name: userInfo.items[i].exercise.name,
                        duration: userInfo.items[i].exercise.time,
                        time: time,
                        type: 'exercise',
                        height: 120
                    })
                }
            } else if (userInfo.items[i].category === 'diet') {
                items[date].push({
                    name: userInfo.items[i].diet.name,
                    calories: userInfo.items[i].diet.calories,
                    time: time,
                    type: 'diet',
                    height: 120
                })
            } else if (userInfo.items[i].category === 'mood') {
                items[date].push({
                    level: userInfo.items[i].mood.level,
                    description: userInfo.items[i].mood.description,
                    time: time,
                    type: 'mood',
                    height: 120
                })
            } else {
                console.log('Error in loadItems: invalid category')
            }

        }

        dates.forEach(date => {
            sort(items[date])
        })

        for (let i = -15; i < 15; i++) {
            const time = Date.now() + i * 24 * 60 * 60 * 1000
            const date = DateToString(time)
            if (!items[date]) {
                items[date] = []
            }
        }


        const newItems = {}
        Object.keys(items).forEach(key => {
            newItems[key] = items[key]
        })
        setItems(newItems)
    }

    const renderEmo = (level) => {
        if (level === -2) {
            return <Image source={require('../assets/icons8-crying.png')} style={{ width: 40, height: 40 }} />
        } else if (level === -1) {
            return <Image source={require('../assets/icons8-sad.png')} style={{ width: 40, height: 40 }} />
        } else if (level === 0) {
            return <Image source={require('../assets/icons8-neutral_emoticon.png')} style={{ width: 40, height: 40 }} />
        } else if (level === 1) {
            return <Image source={require('../assets/icons8-happy.png')} style={{ width: 40, height: 40 }} />
        } else if (level === 2) {
            return <Image source={require('../assets/icons8-lol.png')} style={{ width: 40, height: 40 }} />
        } else if (level === 3) {
            return <Image source={require('../assets/icons8-smiling_face_with_heart.png')} style={{ width: 40, height: 40 }} />
        } else {
            return <Image source={require('../assets/icons8-in_love.png')} style={{ width: 40, height: 40 }} />
        }
    }

    const renderItem = (item) => {
        return (
            <>
                {item.type === 'exercise' ? (
                    <TouchableOpacity style={[styles.item, { height: item.height }]} onPress={handleItem}>
                        <View style={styles.exercise}>
                            <View style={styles.details}>
                                <Text style={{ fontWeight: '400', fontSize: 18 }}>{item.time}</Text>
                                <Text style={{ marginTop: '1%', marginBottom: '2%', fontWeight: '600', fontSize: 22 }}>{item.name}</Text>
                                {item.weight && <Text style={{ fontWeight: '200', fontSize: 16 }}>Weight: {item.weight}</Text>}
                                {item.sets && item.reps && <Text style={{ fontWeight: '200', fontSize: 16 }}>Sets: {item.sets} Reps: {item.reps}</Text>}
                                {item.duration && <Text style={{ fontWeight: '200', fontSize: 16 }}>Duration: {item.duration}</Text>}
                            </View>
                            <View style={[styles.circle, { backgroundColor: 'rgba(255, 0, 0, 0.1)' }]}>
                                {item.weight && <Ionicons name='barbell' size={32} />}
                                {item.duration && <Ionicons name='body' size={32} />}
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : item.type === 'diet' ? (
                    <TouchableOpacity style={[styles.item, { height: item.height }]} onPress={handleItem}>
                        <View style={styles.diet}>
                            <View style={styles.details}>
                                <Text style={{ fontWeight: '400', fontSize: 18 }}>{item.time}</Text>
                                <Text style={{ marginTop: '1%', marginBottom: '2%', fontWeight: '600', fontSize: 22 }}>{item.name}</Text>
                                <Text style={{ fontWeight: '200', fontSize: 16 }}>Calories: {item.calories}</Text>
                            </View>
                            <View style={[styles.circle, { backgroundColor: 'rgba(0, 255, 0, 0.1)' }]}>
                                <Ionicons name='fast-food' size={32} />
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : item.type === 'mood' ? (
                    <TouchableOpacity style={[styles.item, { height: item.height }]} onPress={handleItem}>
                        <View style={styles.mood}>
                            <View style={styles.details}>
                                <Text style={{ fontWeight: '400', fontSize: 18 }}>{item.time}</Text>
                                <Text style={{ marginTop: '1%', marginBottom: '2%', fontWeight: '600', fontSize: 22 }}>Mood</Text>
                                <Text style={{ fontWeight: '200', fontSize: 16 }}>{item.description}</Text>
                            </View>
                            <View style={[styles.circle, { backgroundColor: 'rgba(0, 0, 255, 0.1)' }]}>
                                {renderEmo(item.level)}
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={[styles.item, { height: 50, alignItems: 'center' }]}>
                        <Text>Error</Text>
                    </TouchableOpacity>
                )}
            </>
        )
    }

    const renderEmpty = () => {
        return (
            <View style={styles.emptyDate}>
            </View>
        )
    }

    const rowChange = (r1, r2) => {
        return r1.name !== r2.name
    }

    const DateToString = (date) => {
        const d = new Date(date)
        return d.toISOString().split('T')[0]
    }

    return (
        <>
            <StatusBar hidden='true' />
            <Agenda
                items={items}
                // loadItemsForMonth={loadItems.bind(this)}
                selected={today}
                minDate={'2020-01-01'}
                renderItem={renderItem.bind(this)}
                renderEmptyDate={renderEmpty.bind(this)}
                rowHasChanged={rowChange.bind(this)}
                // theme={{ calendarBackground: 'red', agendaKnobColor: 'green' }}
                hideExtraDays={true}
            />
        </>
    )


}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        padding: 20,
        marginRight: 20,
        marginTop: 25,
    },
    exercise: {
        flexDirection: 'row'
    },
    diet: {
        flexDirection: 'row'
    },
    mood: {
        flexDirection: 'row'
    },
    details: {
        width: '75%'
    },
    circle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyDate: {
        height: 50,
        flex: 1,
        padding: 10,
        marginRight: 20,
        marginTop: 25,
        marginBottom: 25,
        // backgroundColor: 'green',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5
    }
});
