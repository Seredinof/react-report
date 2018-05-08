import { createStore, applyMiddleware, compose } from 'redux'
import reducer from '../reducer'
import logger from '../middleware/logger'
import api from '../middleware/api'
import transformSettingsValues from '../middleware/transformSettingsValues'
import randomId from '../middleware/randomId'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware(randomId, api, transformSettingsValues, logger))

const store = createStore(reducer, {}, enhancer)

//window.store = store
export default store

