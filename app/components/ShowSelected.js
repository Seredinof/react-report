import React, {
    Component,
    PropTypes,
} from 'react';
import DatePicker from './DatePicker'
import { changeSettings, changeSettingsDate } from '../AC/settings'
import { connect } from 'react-redux'

class ShowSelected extends Component {
    render() {
        const {settingsCompositionGroups, settingsCompositionStats, settingsValuesGroups, settingsValuesMetric} = this.props

        const selectedShowGroups = settingsValuesGroups.map(function (item) {
            return <span className="b-show-selected__item"> {settingsCompositionGroups[item].title} </span>
        });

        return (
            <div>
                <div className="b-show-selected">
                    <div className="button button_content_show-selected" onClick={this.props.handleSettingsShow}>
                        <i className="icon icon-plus"/>
                        Группы данных
                    </div>
                    {selectedShowGroups}
                </div>
                <div className="b-show-selected">
                    <div className="button button_content_show-selected" onClick={this.props.handleSettingsShow}>
                        <i className="icon icon-plus"/>
                        Параметр анализа
                    </div>
                    <span className="b-show-selected__item">{settingsCompositionStats[settingsValuesMetric]}</span>
                </div>
                <div className="b-show-selected">
                    <div className="button button_content_show-selected" onClick={this.props.handleSettingsShow}>
                        <i className="icon icon-plus"/>
                        Период
                    </div>
                    <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                        <DatePicker loadData={true}/>
                    </div>
                </div>
            </div>

        );
    }
}

ShowSelected.propTypes = {};
ShowSelected.defaultProps = {};

export default connect(state => ({
    settingsValuesGroups: state.settingsValues.groups,
    settingsValuesMetric: state.settingsValues.metric,
    settingsCompositionGroups: state.settingsComposition.groups,
    settingsCompositionStats: state.settingsComposition.stats
}), { changeSettings, changeSettingsDate })(ShowSelected);

