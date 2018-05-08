import React, { PropTypes } from 'react'
import {
    Circle,
} from 'better-react-spinkit'

function Loader(props) {
    return (
        <div className="dynamic-report-blackout">
            {/*<img className="dynamic-report-spinner" src="/assets/new/images/AjaxLoader.gif"/>*/}
            <Circle size={50} className="dynamic-report-spinner" color="#fff"/>
        </div>
    )
}

Loader.propTypes = {
}

export default Loader