import { LOAD_TABLE_DATA } from '../constants'

const rootElem = document.getElementById('reactReport');
const dataTableUrl = rootElem.getAttribute('data-table-url');

export function loadTableData() {
    const action = {
        type: LOAD_TABLE_DATA,
        callAPI: dataTableUrl,
        paramsSetting: true
    }
    return action
}