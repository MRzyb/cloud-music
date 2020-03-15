import {fromJS} from 'immutable'
import { CHANGE_ENTER_LOADING, CHANGE_CURRENT_ALBUM } from './constant'

const defaultState = fromJS({
    currentAlbum: {},
    entryLoading: false
})

export const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_CURRENT_ALBUM:
            return state.set('currentAlbum', action.data)
        case CHANGE_ENTER_LOADING:
            return state.set('entryLoading', action.data)
        default:
            return state
    }
}
