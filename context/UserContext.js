import React, { useState, createContext } from 'react'

const UserContext = createContext([{}, () => { }])

const UserProvider = (props) => {
    const [state, setState] = useState({
        username: '',
        email: '',
        uid: '',
        isLoggedIn: null,
        profilePicUrl: 'default'
    })

    return <UserContext.Provider value={[state, setState]}>{props.children}</UserContext.Provider>
}

export { UserContext, UserProvider }


/*
BMI - progression screen
booking portal - fake messages
fake admin side - profile screen
finish adding events in diary
*/