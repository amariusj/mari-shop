import axios from 'axios'
import React, {createContext, useEffect, useState} from 'react'
import ProductsAPI from './api/ProductsAPI'
import UserAPI from './api/UserAPI'
import Categories from './api/CategoryAPI'

export const GlobalState = createContext()

export const DataProvider = ({children}) => {

    //Creates a state variable called token and sets it
    //Equal to false by default
    const [token, setToken] = useState(false)


    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin')
        if (firstLogin) {

            const refreshToken = async () => {
                const res = await axios.get('/users/refresh_token')
                setToken(res.data.accesstoken)
    
                setTimeout(() => {
                    refreshToken()
                }, 10 * 60 * 1000)
            }
            refreshToken()
            
        }
    },[])
    


    //Sets the token and products as state items
    const state = {
        token: [token, setToken],
        productsAPI: ProductsAPI(),
        userAPI: UserAPI(token),
        categoriesAPI: Categories()
    }


    //Passes the state to the app
    return(
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}