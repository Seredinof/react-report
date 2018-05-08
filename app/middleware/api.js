import axios from 'axios';
import {START, SUCCESS} from '../constants'
import { getURLOptionsSettings } from '../store/helpers'

export default store => next => action => {
    const { callAPI, type, paramsSetting, ...rest} = action

    if (!callAPI) return next(action)

    next({...rest, type: type + START})

    const params = paramsSetting ? '?'+getURLOptionsSettings(store.getState().settingsValues): null

    axios.get(callAPI + params)
        .then( response => {
            //localStorage.setItem('tableData', JSON.stringify(response.data));
            next({...rest, type: type + SUCCESS, data: response.data})
        })
        .catch(function (error) {
            console.log(error)
        });
}