import {
    CHANGE_SETTINGS,
    ADD_CONDITION,
    CHANGE_SETTINGS_CONDITION,
    DELETE_SETTINGS_CONDITION,
    ADD_FILTER,
    ADD_FILTER_ID,
    CHANGE_SETTINGS_FILTER,
    DELETE_SETTINGS_FILTER,
    CHANGE_SETTINGS_FILTERS,
    CHANGE_SETTINGS_DATE,
    SORT_TABLE_DATA } from '../constants'

export function changeSettings( field, value ) {
    const action = {
        type: CHANGE_SETTINGS,
        payload: { field, value }
    }
    return action
}

export function changeSettingsFilters( field, value ) {
    const action = {
        type: CHANGE_SETTINGS_FILTERS,
        payload: { field, value }
    }
    return action
}

export function changeSettingsDate( value ) {
    const action = {
        type: CHANGE_SETTINGS_DATE,
        payload: { value }
    }
    return action
}

export function changeSettingsCondition(id, field, value) {
    const action = {
        type: CHANGE_SETTINGS_CONDITION,
        payload: {id, field, value }
    }
    return action
}

export function deleteSettingsCondition(id) {
    const action = {
        type: DELETE_SETTINGS_CONDITION,
        payload: {id}
    }
    return action
}

export function addCondition() {
    const action = {
        type: ADD_CONDITION,
        generateId: true
    }
    return action
}

export function changeSettingsFilter(id, field, value) {
    const action = {
        type: CHANGE_SETTINGS_FILTER,
        payload: {id, field, value }
    }
    return action
}

export function deleteSettingsFilter(id) {
    const action = {
        type: DELETE_SETTINGS_FILTER,
        payload: {id}
    }
    return action
}

export function addFilter() {
    const action = {
        type: ADD_FILTER,
        generateId: true
    }
    return action
}

export function addFilterId(id) {
    const action = {
        type: ADD_FILTER_ID,
        id: id
    }
    return action
}

export function sortTableData(field, direction) {
    const action = {
        type: SORT_TABLE_DATA,
        payload: {[field]: direction}
    }
    return action
}