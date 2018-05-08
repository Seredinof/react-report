import React, { PropTypes } from 'react'
import {
    Circle,
} from 'better-react-spinkit'


function Loader(props) {
    return (
        <div style={{textAlign: 'center'}}>
            {/*<img src="/assets/new/images/AjaxLoader.gif"/>*/}
            <Circle size={50} style={{display: 'inline-block'}} />
        </div>
    )
}

Loader.propTypes = {
}

export default Loader