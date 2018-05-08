import React, {
    Component,
    PropTypes,
} from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { changeSettings, deleteSettingsFilter, changeSettingsFilter } from '../AC/settings';
import FilterValues from './FilterValues'

class SettingsFiltersLine extends Component {

    handleDelete = (id) => () => {
        this.props.deleteSettingsFilter(id)
    }

    updateValue = (id, field) => (value) =>{
        this.props.changeSettingsFilter(id, field, value)
    }

    render() {

        const settingsComposition = this.props.settingsComposition;
        const settingsValues = this.props.settingsValues;

        const filters  = settingsComposition.filters;
        const filtersGenerated = settingsValues.filtersGenerated;

        const {id} = this.props;

        return (
            <div className="flex-row">
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <label>Список возможных фильтров</label>
                    <Select className="settings__item"
                            options={ Object.keys(filters).map((key) => {
                                return {
                                    value: key,
                                    label: filters[key].title
                                }
                            })}
                            placeholder="Выберите фильтр"
                            value= { filtersGenerated[id].fieldValue }
                            onChange={this.updateValue(id, 'fieldValue')}
                            noResultsText = 'Результатов не найдено'
                    />
                </div>

                <FilterValues id={id}/>

                <div className="col-xs-12 col-sm-2 col-md-3">
                    <label>&nbsp;</label>
                    <span className="button button_content_settings-condition-del" onClick={this.handleDelete(id)}><i className="icon icon-remove"/> Удалить</span>
                </div>
            </div>
        );
    }
}

SettingsFiltersLine.propTypes = {};
SettingsFiltersLine.defaultProps = {};

export default connect(state => ({
    settingsValues: state.settingsValues,
    settingsComposition: state.settingsComposition,
}), {changeSettings, deleteSettingsFilter, changeSettingsFilter})(SettingsFiltersLine);

