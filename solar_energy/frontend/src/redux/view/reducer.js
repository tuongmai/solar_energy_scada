import { createSlice } from '@reduxjs/toolkit'

const ViewSlice = createSlice({
    name: 'view',
    initialState: {
        view: 'home'
    },
    reducers: {
        setView: (state, action) => {
            state.view = action.payload
        }
    }
})

export const { setView } = ViewSlice.actions

export default ViewSlice.reducer