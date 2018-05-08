// TODO Пересмотерть и вынести логику подготовки таблицы.
import React, {Component} from 'react'
import {Table, Column, ColumnGroup, Cell} from 'fixed-data-table'
import { loadTableData } from '../AC/tableData'
import { connect } from 'react-redux'
import Loader from './Loader'
import LoaderBlackout from './LoaderBlackout'
import LinkCell from './LinkCell'
import TextCell from './TextCell'
import HeaderColumnSort from './HeaderColumnSort'
import {nano}  from '../store/helpers'

import 'fixed-data-table/dist/fixed-data-table.min.css'

class Grid extends Component {

    constructor(){
        super();
        this.state ={
            widthW: document.documentElement.clientWidth-40,
            heightH:  document.documentElement.clientHeight-190,
            columnWidths: {

            }
        }
        this._onColumnResizeEndCallback = this._onColumnResizeEndCallback.bind(this);
    }

    componentWillMount() {
        if(!this.props.loading && !this.props.loaded) this.props.loadTableData();
    }

    componentDidMount() {

        document.addEventListener("DOMContentLoaded", ()=>{
            this.setState({
                widthW: document.documentElement.clientWidth-40,
                heightH:  document.documentElement.clientHeight-190
            })
        });

        window.addEventListener("resize", ()=>{
            this.setState({
                widthW: document.documentElement.clientWidth-40,
                heightH:  document.documentElement.clientHeight-190
            })
        })

    }
    componentWillUpdate(nextProps) {
    }

    mapHeader(key) {
        const {settingsComposition} = this.props;
        let header = key;

        Object.keys(settingsComposition.groups).map(i =>{
            if (key == i) header = settingsComposition.groups[i].title
        })

        Object.keys(settingsComposition.metrics).map(metric =>{
            if(key == metric)  header = settingsComposition.metrics[metric]
        })

        return header
    }

    isHeaderMetrics(key) {
        const {settingsComposition} = this.props;
        let isMetrics = false;
        Object.keys(settingsComposition.metrics).map(i =>{
            if (key == i) isMetrics = true
        })

        return isMetrics;
    }

    _onColumnResizeEndCallback(newColumnWidth, columnKey){
        this.setState(({columnWidths}) => ({
            columnWidths: {
                ...columnWidths,
                [columnKey]: newColumnWidth,
            }
        }));
    }

    stringSize(str) {
        var s = document.createElement("span")
        s.innerHTML=str;
        s.style.visibility="hidden";
        s.style.whiteSpace="nowrap";
        document.body.appendChild(s);
        var res={width:s.offsetWidth,height:s.offsetHeight};
        document.body.removeChild(s);
        return res;
    }

    columnsWidthMax() {
        const { data, settingsComposition } = this.props
        const dictionaries = data.dictionaries;
        const cellsUseDictionary = this.getCellsUseDictionary();

        const fields = Object.keys(data.values[0]);
        let columns = {};

        data.values.map((row) =>{
            fields.map(column => {

                let str = row[column];

                if(cellsUseDictionary.indexOf(column) != -1) {
                    if(dictionaries[column][row[column]] != undefined){
                        str = nano(settingsComposition.groups[column].titleTemplate, dictionaries[column][row[column]] )
                    } else {
                        str = row[column] + ', NO DICTIONARY'
                    }
                }

                if(columns[column] == undefined) {
                    columns[column]=[];
                    columns[column].push(this.stringSize(str).width)
                } else {
                    columns[column].push(this.stringSize(str).width)
                }
            })
        })

        let columnsMax = {};

        for(let column in columns) {
            columnsMax[column] = Math.max.apply(null, columns[column]) + 16
        }
        return columnsMax;
    }

    getCellsLink() {
        const groups = this.props.settingsComposition.groups;
        let arrLink = []

        Object.keys(groups).map(key => {
            if(groups[key].format == 'link') arrLink.push(key)
        })

        return arrLink
    }

    getCellsUseDictionary() {
        const groups = this.props.settingsComposition.groups;
        let arrDic = []

        Object.keys(groups).map(key => {
            if(groups[key].useDictionary) arrDic.push(key)
        })

        return arrDic
    }

    getCellBg() {
        const {data} = this.props;
        const fields = Object.keys(data.values[0]);
        let columns = {};
        columns.allCellWithData = [];

        let groupsArr = Object.keys(this.props.settingsComposition.groups);

        data.values.map((row) =>{
            fields.map(column => {
                let value = row[column];

                if(value == '∞') value = Infinity
                if(value == null || value == '' || value == ' ' ) value = 0;
                else value = parseFloat(+value.toString().replace(/\s{1,}/g,'').replace(',','.').replace('%',''));


                /*if(column == 'current_affiliate_employee_id' || column == 'affiliate_id' || column == 'offer_id' && column == 'goal' && column == 'platform_id') {
                    return;
                }*/

                if(groupsArr.indexOf(column) !== -1) {
                    return;
                }

                if(columns[column] == undefined) {
                    columns[column]=[];
                }

                columns[column].push(value)

                if((new Date(column) != 'Invalid Date')) {
                    columns.allCellWithData.push(value)
                }

            })
        })

        let columnsMax = {};
        let columnsMin = {};

        for(let column in columns) {

            columnsMax[column] = Math.max.apply(null, columns[column])
            columnsMin[column] = Math.min.apply(null, columns[column])

            if(column == 'period_dynamic') {

                let negativeValues = [],
                    positiveValues = [],
                    positiveMax,
                    positiveMin,
                    negativeMax,
                    negativeMin;

                for(let i=0; i < columns[column].length; i++) {
                    if(columns[column][i]>=0) {
                        positiveValues.push(columns[column][i])
                    } else {
                        negativeValues.push(Math.abs(columns[column][i]))
                    }
                }

                positiveMax = 0;
                positiveMin = 0;
                negativeMax = 0;
                negativeMin = 0;

                for(let i=0; i < positiveValues.length; i++) {
                    if(positiveMax <= positiveValues[i] && positiveValues[i] != Infinity) {
                        positiveMax = positiveValues[i]
                    }

                    if(positiveMin >= positiveValues[i] && positiveValues[i] != Infinity) {
                        positiveMin = positiveValues[i]
                    }
                }

                for(let i=0; i < negativeValues.length; i++) {

                    if(negativeMax <= negativeValues[i] && negativeValues[i] != -Infinity) {
                        negativeMax = negativeValues[i]
                    }

                    if(negativeMin >= negativeValues[i] && negativeValues[i] != -Infinity) {
                        negativeMin = negativeValues[i]
                    }

                }

                columnsMax[column] = {positive: positiveMax, negative: negativeMax};
                columnsMin[column] = {positive: positiveMin, negative: negativeMin};

                for(let i=0; i < positiveValues.length; i++) {
                    if(positiveValues[i] == Infinity) {
                        positiveValues[i] = columnsMax[column].positive
                    }
                }

                for(let i=0; i < negativeValues.length; i++) {
                    if(negativeValues[i] == -Infinity) {
                        negativeValues[i] = columnsMax[column].negative
                    }
                }
            }
        }

        let columnsOpacity = {};

        for(let column in columns) {

            columnsOpacity[column] = columns[column].map(cell => {

                if((new Date(column) != 'Invalid Date')){
                    return this.getOpacity(columnsMin['allCellWithData'], columnsMax['allCellWithData'], cell)
                }

                if(column == 'period_dynamic') {
                    if(cell>=0) {
                        return this.getOpacityUniversal(columnsMin[column].positive, 0, columnsMax[column].positive, 100, cell)
                    } else {
                        return -(this.getOpacityUniversal(columnsMin[column].negative, 0, columnsMax[column].negative, 100, Math.abs(cell)))
                    }
                }

                return this.getOpacity(columnsMin[column], columnsMax[column], cell)
            })
        }
        return columnsOpacity;
    }

    getOpacity(min, max, x) {
        return ((max-min) != 0) ? ((x-min)*100)/(max-min) : 0;
    }
    getOpacityUniversal(x1,y1, x2, y2, x) {
        return (((x2-x1) + y1) != 0) ? (x-x1)*(y2-y1)/(x2-x1) + y1 : 0
    }

    getColumns() {
        const {data, settingsValuesGroups, settingsComposition, settingsValuesDateTimeGroupsBy} = this.props;

        var {columnWidths} = this.state;

        const columnsWidthMax = this.columnsWidthMax();

        const cellsLink = this.getCellsLink();
        const cellsUseDictionary = this.getCellsUseDictionary();

        const columnsOpacity = this.getCellBg();

        const columns = Object.keys(data.values[0]).map((key)=>{

            const fixed = !(settingsValuesGroups.indexOf(key)== -1)
            const header = this.mapHeader(key)
            const isHeaderDate = (new Date(header) != 'Invalid Date')
            const isHeaderMetrics = this.isHeaderMetrics(key);
            const isSort = !(settingsComposition.availableSortOrder.columns.indexOf(key) == -1)
            const isDictionary = (cellsUseDictionary.indexOf(key) != -1)
            const isLink = (cellsLink.indexOf(key) != -1)
            const columnOpacity = (columnsOpacity[key]) ? columnsOpacity[key] : null;

            let cell = <TextCell data={data} field={key} columnOpacity = {columnOpacity}/>;

            if(isDictionary) {
                cell = <TextCell data={data} field={key} titleTemplate = { settingsComposition.groups[key].titleTemplate}
                                 columnOpacity = {columnOpacity}/>
            }

            if(isLink) {
                cell = <LinkCell data={data} field={key}
                                 linkTemplate = { settingsComposition.groups[key].linkTemplate }
                                 titleTemplate = { settingsComposition.groups[key].titleTemplate } />
            }

            const colMinWidth = (isHeaderDate) ? 30 : ((isHeaderMetrics) ? 100 : 150);
            let colWidth = (colMinWidth > columnsWidthMax[key]) ? colMinWidth : columnsWidthMax[key]
            if(isSort) {
                colWidth = colWidth + 20;
            }

            let column = <Column
                key = {key}
                columnKey={key}
                fixed={fixed}
                header={ isSort ? <HeaderColumnSort field={key}>{header}</HeaderColumnSort> :
                    isHeaderDate ? <Cell data={data} field={key}><div className={(settingsValuesDateTimeGroupsBy == 'hour') ? "grid-date-header grid-date-header_long" : "grid-date-header"}>{header}</div></Cell> :
                        <Cell data={data} field={key}>{header}</Cell>}
                cell={cell}
                width={columnWidths[key] || colWidth}
                isResizable={true}
            />

            return column
        });

        return columns
    }

    render() {
        const {data, loading, loaded, settingsValuesDateTimeGroupsBy} = this.props;
        let body = <div>Нет данных</div>

        if(loading && !loaded) {

            body = <Loader/>

            if(data.status == 'error') {
                body = <div><b>Ошибка:</b><br/> {data.errorMessage}</div>
            }

        } else {
            if(loaded) {
                if(data.status == 'success') {
                    if(data.values.length) {

                        const columns = this.getColumns();

                        body = <Table
                            headerHeight={(settingsValuesDateTimeGroupsBy == 'hour') ? 140 : 90}
                            rowsCount={data.values.length}
                            rowHeight={25}
                            width={this.state.widthW}
                            maxHeight={this.state.heightH}
                            onColumnResizeEndCallback={this._onColumnResizeEndCallback}
                            isColumnResizing={false}>
                            {columns}
                        </Table>
                    }
                }

                if(data.status == 'error') {
                    body = <div><b>Ошибка:</b><br/> {data.errorMessage}</div>
                }
            }
        }

        return (
            <div style={{position: 'relative'}}>
                {body}
                {(loading && loaded) ? <LoaderBlackout/> : null}
            </div>
        )
    }
}

export default connect(state=>({
    data: state.tableData.data,
    loading: state.tableData.loading,
    loaded: state.tableData.loaded,
    settingsValuesGroups: state.settingsValues.groups,
    settingsValuesDateTimeGroupsBy: state.settingsValues.dateTime.groupsBy,
    settingsComposition: state.settingsComposition
}), { loadTableData })(Grid)