import React, { createContext } from 'react'

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import firebaseConf from '../config/firebase'

const FirebaseContext = createContext()

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConf)
}

const db = firebase.firestore()

const Firebase = {


    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            const uid = Firebase.getCurrentUser().uid

            await db.collection('users').doc(uid).set({
                username: user.username,
                email: user.email 
            })

            await Firebase.initItems(uid)

            delete user.password

            return { ...user, uid }

        } catch (error) {
            console.log('Error with createUser in FirebaseContext: ', error.message)
            return error.code
        }
    },

    getCurrentUser: () => {
        return firebase.auth().currentUser
    },

    getUserInfo: async (uid) => {
        try {
            const user = await db.collection('users').doc(uid).get()

            if (user.exists) {
                return user.data()
            }
        } catch (error) {
            console.log('Error with getUserInfo in FirebaseContext: ', error)
        }
    },

    uploadProfilePic: async (uri) => {
        const uid = Firebase.getCurrentUser().uid

        try {
            const photo = await Firebase.getBlob(uri)

            const imageRef = firebase.storage().ref('profilePics').child(uid)
            await imageRef.put(photo)

            const url = await imageRef.getDownloadURL()

            await db.collection('users').doc(uid).update({
                profilePicUrl: url
            })

            return url
        } catch (error) {
            console.log('Error with uploadProfilePic in FirebaseContext: ', error)
        }
    },

    getBlob: async (uri) => {
        return await new Promise((res, rej) => {
            const xhr = new XMLHttpRequest()

            xhr.onload = () => {
                res(xhr.response)
            }

            xhr.onerror = () => {
                rej(new TypeError('Network request failed'))
            }

            xhr.responseType = 'blob'
            xhr.open('GET', uri, true)
            xhr.send(null)
        })
    },

    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    },

    logOut: async () => {
        try {
            await firebase.auth().signOut()
            return true
        } catch (error) {
            console.log('Error with logOut in FirebaseContext: ', error)
        }
        return false
    },

    initItems: async (uid) => {
        try {
            await db.collection('users').doc(uid).update({
                items: []
            })
        } catch (error) {
            console.log('Error with initItems in FirebaseContext: ', error)
        }
    },

    updateDB: async (uid, array) => {
        try {
            const userRef = db.collection('users').doc(uid)

            const res = await userRef.update({ items: array })
            return true
        } catch (error) {
            console.log('Error with updateDB in FirebaseContext: ', error)
        }
        return false
    },

    resetPassword: async (email) => {
        return firebase.auth().sendPasswordResetEmail(email)
    }
}

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>
}

export { FirebaseContext, FirebaseProvider }