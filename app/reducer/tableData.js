import {LOAD_TABLE_DATA, START, SUCCESS, FAIL} from '../constants'

const defaultState = {
    data: [],
    loading: false,
    loaded: false
}

export default ( tableData = defaultState, action) => {
    const { type, data } = action
    switch (type) {
        case LOAD_TABLE_DATA + START:
            return {...tableData, loading: true}
        break
        case LOAD_TABLE_DATA + SUCCESS:
            return {...tableData, data: data, loading: false, loaded: true}
    }
    return tableData
}