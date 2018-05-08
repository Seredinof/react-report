import React, {
    Component,
    PropTypes,
} from 'react';

import ReactHighcharts from 'react-highcharts'
import { loadTableData } from '../AC/tableData'
import { connect } from 'react-redux'
import {nano}  from '../store/helpers'
import Loader from './Loader'
import LoaderBlackout from './LoaderBlackout'

class Chart extends Component {

    constructor(){
        super();
        /*this.state = {

        }*/
    }

    componentWillMount() {

        if(!this.props.loading && !this.props.loaded) this.props.loadTableData();

        this.updateChart(this.getX(), this.getY());
    }

    componentDidMount() {
        window.addEventListener("resize", ()=>{
            this.setState({
                chart: {
                    type: 'spline',
                    height: document.documentElement.clientHeight-190
                }
            })
        })
    }

    getX = () =>{
        const { data } = this.props;
        let arrX = []

        if(data.values[0]) {
            Object.keys(data.values[0]).map(item => {
                (new Date(item) != 'Invalid Date') ? arrX.push(item) : null
            })
        }


        return arrX
    }

    getY = () => {
        const { data, settingsComposition } = this.props;
        const dictionaries = data.dictionaries;
        let arrY = [];

        if(data.values[0]) {

            const columns = Object.keys(data.values[0]);
            const groups = Object.keys(settingsComposition.groups);

            data.values.map(row => {
                let arrValue = []
                let arrName = []
                columns.map(column=>{

                    if(new Date(column) != 'Invalid Date') {
                        const value = parseFloat((row[column] == null) ? null : +row[column].toString().replace(/\s{1,}/g,'').replace(',','.').replace('%',''));
                        arrValue.push(value);
                    } else{
                        if(groups.indexOf(column) != -1) {
                            let str;
                            //console.log({}.toString.call(dictionaries));
                            if({}.toString.call(dictionaries) == "[object Object]" && dictionaries[column]!= undefined && dictionaries[column][row[column]] != undefined) {
                                str = nano(settingsComposition.groups[column].titleTemplate, dictionaries[column][row[column]])
                            } else {
                                str = row[column]/* + ', NO DICTIONARY'*/
                            }
                            arrName.push(str)
                        }
                    }
                })

                arrY.push({
                    name: arrName.join(' - '),
                    data: arrValue
                })
            })
        }
        return arrY;

    }

    config = {

    }

    updateChart = (x, y) =>{
        this.config = {
            chart: {
                type: 'spline',
                height: document.documentElement.clientHeight-190,
                zoomType: 'x',
                isZoomed: true
            },
            title: {
                text: 'График'
            },
            subtitle: {
                text: 'Динамика'
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: x
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            tooltip: {

            },
            plotOptions: {
                spline: {
                    marker: {
                        radius: 4,
                        lineColor: '#666666',
                        lineWidth: 1
                    }
                }
            },
            series: y
        }
    }

    render() {
        const {data, loading, loaded} = this.props;
        let body = <div>Нет данных</div>

        if(loading && !loaded) {
            body = <Loader/>
        } else {
            if (loaded) {
                if (data.status == 'success') {
                    if(data.values.length) {
                        this.updateChart(this.getX(), this.getY());
                        body = <ReactHighcharts config={this.config}/>
                    }
                }

                if(data.status == 'error') {
                    body = <div>{data.errorMessage}</div>
                }
            }
        }

        return (
            <div style={{position: 'relative'}}>
                {body}
                {(loading && loaded) ? <LoaderBlackout/> : null}
            </div>
        );
    }
}

Chart.propTypes = {};
Chart.defaultProps = {};

export default connect(state=>({
    data: state.tableData.data,
    loading: state.tableData.loading,
    loaded: state.tableData.loaded,
    settingsComposition: state.settingsComposition
}), { loadTableData })(Chart);

