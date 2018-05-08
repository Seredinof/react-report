import { combineReducers } from 'redux'
import  tableData  from './tableData'
import  settingsValues  from './settingsValues'
import  settingsComposition  from './settingsComposition'

export default combineReducers({ settingsValues, settingsComposition, tableData  })