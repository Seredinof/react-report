import React, {
    Component,
    PropTypes,
} from 'react';
import { Cell } from 'fixed-data-table'
import { connect } from 'react-redux'
import { sortTableData } from '../AC/settings'
import { loadTableData } from '../AC/tableData'

class HeaderColumnSort extends Component {

    handleClick = () => {
        const {field, settingsValues, sortTableData, loadTableData} = this.props;
        let direction = 'desc';

        if(settingsValues.sortOrder){
            if(settingsValues.sortOrder[field]) {
                direction = (settingsValues.sortOrder[field] == 'asc') ? 'desc' : 'asc'
            }
        }

        sortTableData(field, direction);
        loadTableData();
    }

    render() {
        const {field, settingsValues,...props} = this.props;
        let cls = '';
        let caret = <span className="caret" onClick = {this.handleClick} style={{cursor: 'pointer'}}></span>;

        if(settingsValues.sortOrder){
            if(settingsValues.sortOrder[field]) {
                cls = settingsValues.sortOrder[field].toLowerCase()
            }
        }
        return (
            <Cell {...props} className={cls}>
                <span onClick = {this.handleClick} style={{cursor: 'pointer'}}>{ this.props.children }</span>
                { caret }
            </Cell>
        );
    }
}

HeaderColumnSort.propTypes = {};
HeaderColumnSort.defaultProps = {};

export default connect(state=>({
    settingsValues: state.settingsValues
}),{ sortTableData, loadTableData })(HeaderColumnSort);

