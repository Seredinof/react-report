import React from 'react'
import Select from 'react-select'
import DatePicker from './DatePicker'
import { changeSettings, changeSettingsDate } from '../AC/settings'
import { connect } from 'react-redux'
import { transformObjForStore, transformGroupsForSelect, transformObjForSelect } from '../store/helpers'

import 'react-select/dist/react-select.css'

class SettingsMain extends React.Component {

    updateValue = (field) => (value) =>{
        this.props.changeSettings(field, transformObjForStore(value))
    }

    render () {
        const {settingsCompositionGroups, settingsCompositionStats, settingsValuesGroups, settingsValuesMetric, settingsCompositionGroupsNatural} = this.props;
        return (
            <div className="flex-row b-settings-main">
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <label className="b-label-main">Группы данных</label>
                    <Select multi className="settings__item" options={
                        settingsValuesGroups.length >= 6 ? settingsValuesGroups.map(function (item) {
                        return {
                            value: item,
                            label: settingsCompositionGroupsNatural[item].title
                        }
                    }) : settingsCompositionGroups }
                            placeholder="Группы"
                            value= { settingsValuesGroups }
                            onChange={ this.updateValue('groups') }
                            noResultsText = 'Результатов не найдено'
                    />
                    <div className="b-field-desc">Выберите одну или несколько групп</div>
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <label className="b-label-main">Параметр анализа</label>
                    <Select className="settings__item" options={ settingsCompositionStats } placeholder="Показатель"
                            value= { settingsValuesMetric}
                            onChange={ this.updateValue('metric') }
                            noResultsText = 'Результатов не найдено'
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3">
                    <label className="b-label-main">Период</label>
                    <div className="settings__item">
                        <DatePicker />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
        settingsValuesGroups: state.settingsValues.groups,
        settingsValuesMetric: state.settingsValues.metric,
        settingsCompositionGroups: transformGroupsForSelect(state.settingsComposition.groups),
        settingsCompositionGroupsNatural: state.settingsComposition.groups,
        settingsCompositionStats: transformObjForSelect(state.settingsComposition.stats)
}), { changeSettings, changeSettingsDate })(SettingsMain)