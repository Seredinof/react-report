// TODO переписать на immutable.js

import {
    CHANGE_SETTINGS,
    CHANGE_SETTINGS_DATE,
    ADD_CONDITION,
    CHANGE_SETTINGS_CONDITION,
    DELETE_SETTINGS_CONDITION,
    ADD_FILTER,
    ADD_FILTER_ID,
    CHANGE_SETTINGS_FILTER,
    DELETE_SETTINGS_FILTER,
    CHANGE_SETTINGS_FILTERS,
    SORT_TABLE_DATA} from '../constants'

const rootElem = document.getElementById('reactReport');

const defaultSettingsValues = {...JSON.parse(rootElem.getAttribute('data-settings-values'))};

export default ( settingsValues = defaultSettingsValues, action) => {
    const { type, payload, generatedId, id } = action
    switch (type) {

        case CHANGE_SETTINGS:
            return {...settingsValues, [payload.field]: payload.value}

        case CHANGE_SETTINGS_FILTERS:
            return {...settingsValues, filters: {...settingsValues.filters, [payload.field]: payload.value}}

        case CHANGE_SETTINGS_DATE:
            return {...settingsValues, dateTime: {...settingsValues.dateTime, ...payload.value}}

        case ADD_CONDITION:
            return {...settingsValues, conditions: {...settingsValues.conditions, [generatedId]: {id:generatedId}}}
        case CHANGE_SETTINGS_CONDITION:
            return {...settingsValues, conditions: {...settingsValues.conditions, [payload.id]: {...settingsValues.conditions[payload.id], [payload.field]:payload.value}}}
        case DELETE_SETTINGS_CONDITION:
            delete settingsValues.conditions[payload.id]
            return {...settingsValues, conditions: {...settingsValues.conditions}}

        case ADD_FILTER:
            return {...settingsValues, filtersGenerated: {...settingsValues.filtersGenerated, [generatedId]: {id:generatedId}}}
        case ADD_FILTER_ID:
            return {...settingsValues, filtersGenerated: {...settingsValues.filtersGenerated, [id]: {id:id}}}
        case CHANGE_SETTINGS_FILTER:
            return {...settingsValues, filtersGenerated: {...settingsValues.filtersGenerated, [payload.id]: {...settingsValues.filtersGenerated[payload.id], [payload.field]:payload.value}}}
        case DELETE_SETTINGS_FILTER:
            if(settingsValues.filtersGenerated[payload.id].fieldValue) {
                delete settingsValues.filters[settingsValues.filtersGenerated[payload.id].fieldValue.value]
            }
            delete settingsValues.filtersGenerated[payload.id]
            return {...settingsValues, filtersGenerated: {...settingsValues.filtersGenerated}}

        case SORT_TABLE_DATA:
            return {...settingsValues, sortOrder: {...payload}}

    }

    return settingsValues
}
