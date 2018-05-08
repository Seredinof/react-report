import React, {Component} from 'react'
import { Cell } from 'fixed-data-table'
import {nano}  from '../store/helpers'

class LinkCell extends Component {

    getView = () =>{
        const {rowIndex, field, data, linkTemplate, titleTemplate} = this.props;
        const dictionaries = data.dictionaries;
        const id = data.values[rowIndex][field];
        let str;

        if(dictionaries[field][id] != undefined) {
            str = <a href={ nano(linkTemplate, { id: id }) }>
                { nano(titleTemplate, dictionaries[field][id]) }
            </a>
        } else {
            str = <a href={ nano(linkTemplate, { id: id }) }>
                {id}, NO DICTIONARY
            </a>
        }



        return str;
    }

    render() {
        const {rowIndex, field, data, ...props} = this.props;
        return (
            <Cell {...props}>
                {this.getView()}
            </Cell>
        );
    }
}

export default LinkCell