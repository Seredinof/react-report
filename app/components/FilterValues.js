import React, {
    Component,
    PropTypes,
} from 'react';
import Select from 'react-select'
import { changeSettingsFilters } from '../AC/settings'
import { connect } from 'react-redux'
import { transformObjForSelect} from '../store/helpers'
import { getOptions} from '../api/report-api';


class FilterValues extends Component {

    updateValue = (field) => (value) =>{
        this.props.changeSettingsFilters(field, value)
    }

    render() {
        const AsyncComponent = Select.Async;

        const { id, settingsCompositionFilters, settingsValuesFilters, settingsValuesFiltersGenerated } = this.props;

        const filter = (settingsValuesFiltersGenerated[id] && settingsValuesFiltersGenerated[id].fieldValue) ? settingsValuesFiltersGenerated[id].fieldValue.value : null;

        if(filter) {
            if(settingsCompositionFilters[filter].type == 'select') {
                return (
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <label>{settingsCompositionFilters[filter].title}</label>
                        <Select multi = {true} className="settings__item"
                                options={ transformObjForSelect(settingsCompositionFilters[filter].options) }
                                placeholder={ settingsCompositionFilters[filter].title }
                                value= { (settingsValuesFilters && settingsValuesFilters[filter]) ? settingsValuesFilters[filter] : null }
                                onChange={ this.updateValue(filter) }
                                noResultsText = 'Результатов не найдено'
                        />
                    </div>
                )
            }

            if(settingsCompositionFilters[filter].type == 'remoteSelect') {
                return (
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <label>{settingsCompositionFilters[filter].title}</label>
                        <AsyncComponent multi={true} className="settings__item" placeholder={settingsCompositionFilters[filter].title}
                                        value= { (settingsValuesFilters && settingsValuesFilters[filter]) ? settingsValuesFilters[filter] : null }
                                        onChange={ this.updateValue(filter) }
                                        loadOptions={ getOptions(settingsCompositionFilters[filter].options.url) }
                        />
                    </div>
                )
            }

            if(settingsCompositionFilters[filter].type == 'keyword') {
                return (
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <label>{settingsCompositionFilters[filter].title} (Теги)</label>
                        <Select.Creatable
                            multi={true}
                            placeholder="введите текст и нажмите enter"
                            value= { (settingsValuesFilters && settingsValuesFilters[filter]) ? settingsValuesFilters[filter] : null }
                            onChange={ this.updateValue(filter) }
                        />
                    </div>
                )
            }
        }

        return (
            <div></div>
        )
    }
}

FilterValues.propTypes = {};
FilterValues.defaultProps = {};

export default connect(state => ({
    settingsValuesFilters: state.settingsValues.filters,
    settingsValuesFiltersGenerated: state.settingsValues.filtersGenerated,
    settingsCompositionFilters: state.settingsComposition.filters,
}), { changeSettingsFilters })(FilterValues);
