import React, {
    Component,
    PropTypes,
} from 'react';
import { changeSettings } from '../AC/settings'
import { loadTableData } from '../AC/tableData'
import { connect } from 'react-redux'
import { getURLOptionsSettings } from '../store/helpers'
import ShowSelected from './ShowSelected'

class SettingsGrid extends Component {

    componentDidMount = () => {
        const {settingsValuesPageOffset} = this.props;
        this.props.changeSettings("pages", {limit: +this.settingsGridLimit.value, offset: settingsValuesPageOffset})
    }

    handleSelectChange = () => {
        const {settingsValuesPageOffset} = this.props;
        this.props.changeSettings("pages", {limit: +this.settingsGridLimit.value, offset: settingsValuesPageOffset})
        this.props.loadTableData()
    }

    handleClickPseudoTabs = (tabName) => () => {
        this.props.handlePseudoTabs(tabName);
    }

    handleClickNext = (event) => {
        event.preventDefault();

        const {settingsValuesPageOffset, settingsTableDataHasNextPage, settingsValuesPageLimit} = this.props;

        if(settingsTableDataHasNextPage) {
            this.props.changeSettings("pages", {limit: +this.settingsGridLimit.value, offset: settingsValuesPageOffset+1*settingsValuesPageLimit})
            this.props.loadTableData()
        }


    }
    handleClickPrevious = (event) => {
        event.preventDefault();

        const {settingsValuesPageOffset, settingsValuesPageLimit} = this.props;

        if(settingsValuesPageOffset > 0) {
            this.props.changeSettings("pages", {limit: +this.settingsGridLimit.value, offset: settingsValuesPageOffset-1*settingsValuesPageLimit})
            this.props.loadTableData()
        }
    }


    render() {
        const {settingsValuesPageLimit, activeTab, settingsValuesPageOffset, settingsTableDataHasNextPage, tableDataValues, tableDataLoaded, tableDataStatus} = this.props;
        const bodyOffset = <li><a>{settingsValuesPageOffset/settingsValuesPageLimit + 1}</a></li>;

        return (
            <div className="flex-row b-settings-grid">
                <div className="col-xxs-12 col-md-6 col-lg-7">
                    <ShowSelected handleSettingsShow = {this.props.handleSettingsShow}/>
                </div>
                <div className="col-xxs-12 col-md-6 col-lg-5 end-md">
                    <span className={`btn btn_type_pseudo-tabs ${ activeTab == 'grid' ? 'disabled' : null}`} onClick={this.handleClickPseudoTabs('grid')}>
                        <i className="icon-table"></i> Таблица
                    </span>
                    <span className={`btn btn_type_pseudo-tabs ${ activeTab == 'chart' ? 'disabled' : null}`} onClick={this.handleClickPseudoTabs('chart')}>
                        <img className="ico-img" src="/images/menu/03.png"/> График
                    </span>

                    <a href={"/reports/dynamic/export?" + getURLOptionsSettings(this.props.settingsValues)} className="button button_content_export-report btn green">Экспорт отчета</a>

                    <select className="page_size-yw21 page-size metronic b-page-size"
                            onChange={this.handleSelectChange}
                            ref={(select) => this.settingsGridLimit = select}
                            value={settingsValuesPageLimit}>
                        <option key="5" value="5">5</option>
                        <option key="10" value="10">10</option>
                        <option key="20" value="20">20</option>
                        <option key="30" value="30" >30</option>
                        <option key="50" value="50">50</option>
                        <option key="100" value="100">100</option>
                        <option key="150" value="150">150</option>
                    </select>

                    { (tableDataLoaded && tableDataStatus == 'success' && tableDataValues.length < settingsValuesPageLimit) ? <span style={{marginLeft: "10px"}}>Итого {tableDataValues.length} </span> : null}

                    <div className="pagination metronic b-pagination">
                        <ul className="pagination-centered b-pagination__content">
                            {(settingsValuesPageOffset != 0) ? <li className="previous"><a href="#" onClick={this.handleClickPrevious}>&lt;</a></li> : null}
                            {((settingsValuesPageOffset == 0) && !settingsTableDataHasNextPage) ? null : bodyOffset }
                            { settingsTableDataHasNextPage ? <li className="next"><a href="#" onClick={this.handleClickNext}>&gt;</a></li> : null }
                        </ul>
                    </div>

                </div>
            </div>
        );
    }
}

SettingsGrid.propTypes = {};
SettingsGrid.defaultProps = {};

export default connect(state=>({
    settingsValues: state.settingsValues,
    settingsValuesPageLimit: state.settingsValues.pages.limit,
    settingsValuesPageOffset: state.settingsValues.pages.offset,
    settingsTableDataHasNextPage: state.tableData.data.hasNextPage,
    tableDataValues: state.tableData.data.values,
    tableDataLoaded: state.tableData.loaded,
    tableDataStatus: state.tableData.data.status
}), { changeSettings, loadTableData })(SettingsGrid);

