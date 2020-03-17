import * as actionTypes from './constant'
import {fromJS} from 'immutable'

const defaultStatus = fromJS({
    artist: {},
    songsOfArtist: [],
    loading: true
})

export default (state = defaultStatus, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_ARTIST:
            return state.set('artist', action.data)
        case actionTypes.CHANGE_SONGS_OF_ARTIST:
            return state.set('songsOfArtist', action.data)
        case actionTypes.CHANGE_ENTRY_LOADING:
            return state.set('loading', action.data)
        default:
            return state
    }
}
