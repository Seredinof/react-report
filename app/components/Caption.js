import React, {
    Component,
    PropTypes,
} from 'react';
import { connect } from 'react-redux';

class Caption extends Component {
    render() {
        return (
            <div className="caption">
                <i className="icon-reorder"></i>
                Динамический отчет - {this.props.settingsCompositionStats[this.props.settingsValuesMetric]}
            </div>
        );
    }
}

Caption.propTypes = {};
Caption.defaultProps = {};

export default connect(state=>({
    settingsValuesMetric: state.settingsValues.metric,
    settingsCompositionStats: state.settingsComposition.stats
}), null)(Caption);

