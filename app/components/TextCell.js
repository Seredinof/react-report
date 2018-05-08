import React, {Component} from 'react'
import {Cell} from 'fixed-data-table'
import {nano}  from '../store/helpers'

export  default  class TextCell extends Component {

    getView = () =>{
        const {rowIndex, field, data, titleTemplate} = this.props;
        const dictionaries = data.dictionaries;
        const id = data.values[rowIndex][field];
        let str

        if(dictionaries[field][id] != undefined) {
            str = nano(titleTemplate, dictionaries[field][id])
        } else {
            if (id) {
                str = id + ',NO DICTIONARY'
            } else {
                str = '';
            }
        }


        return str;
    }

    render() {
        const {rowIndex, field, data, columnOpacity, ...props} = this.props;
        let bg = null,
            textAlign = 'left'
        if(columnOpacity != undefined && columnOpacity != null) {
            if(!isNaN(columnOpacity[rowIndex])) {
                textAlign = 'right';
                if(columnOpacity[rowIndex]>=0){
                    bg = `rgba(53, 170, 71, ${columnOpacity[rowIndex]/100})`
                } else {
                    bg = `rgba(232, 33, 90, ${columnOpacity[rowIndex]/-100})`
                }
            }
        }
        return (
            <Cell {...props} style={{background: bg, textAlign: textAlign}}>
                { (this.props.titleTemplate) ? this.getView() : data.values[rowIndex][field] }
            </Cell>
        );
    }
}