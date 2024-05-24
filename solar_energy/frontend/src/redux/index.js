import { combineReducers, configureStore } from '@reduxjs/toolkit'
import viewReducer from './view/reducer'

const reducer = combineReducers({
    view: viewReducer
})

const store = configureStore({
    reducer
})

export default store