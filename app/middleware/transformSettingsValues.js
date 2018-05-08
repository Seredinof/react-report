import axios from 'axios';
import {CHANGE_SETTINGS, CHANGE_SETTINGS_FILTERS} from '../constants'
import { transformObjForSelectTag} from '../store/helpers'

export default store => next => action => {
    const { type, ...rest} = action;

    let toString = {}.toString;
    let filtersValues = store.getState().settingsValues.filters;
    let filtersComposition = store.getState().settingsComposition.filters;
    let payloadValueTransform = {};

    if(type == CHANGE_SETTINGS && filtersValues) {
        Object.keys(filtersValues).map(key => {
            if(toString.call(filtersValues[key][0]) == "[object String]" && filtersComposition[key].type == 'remoteSelect' ) {
                filtersValues[key].map(id =>{
                    if(!payloadValueTransform[key]) payloadValueTransform[key] = []
                    axios.get(filtersComposition[key].options.url+'?id='+id)
                        .then(response => {
                            payloadValueTransform[key].push({
                                label: response.data.title,
                                value: response.data.id
                            });
                            next({...rest, type: CHANGE_SETTINGS_FILTERS, payload: {field: key, value: payloadValueTransform[key]}});
                        });
                })
            }

            if(toString.call(filtersValues[key][0]) == "[object String]" && filtersComposition[key].type == 'keyword' ) {
                next({...rest, type: CHANGE_SETTINGS_FILTERS, payload: {field: key, value: transformObjForSelectTag(filtersValues[key])}});
            }
        });
    }

    next(action);
}