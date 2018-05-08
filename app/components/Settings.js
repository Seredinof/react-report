import React from 'react'
import { loadTableData } from '../AC/tableData'
import { addCondition, changeSettings, addFilter, addFilterId, changeSettingsFilter } from '../AC/settings'
import { connect } from 'react-redux'
import SettingsMain from './SettingsMain'
import SettingsFiltersLine from './SettingsFiltersLine'
import Condition from './Condition'

import 'react-select/dist/react-select.css'

class Settings extends React.Component {

    componentDidMount() {

        const { conditions, filters, filtersGenerated } = this.props.settingsValues;
        if(filters && !filtersGenerated) {
            Object.keys(filters).map(filter => {
                const randomId = Date.now() + Math.random();
                this.props.addFilterId(randomId);
                this.props.changeSettingsFilter(randomId, 'fieldValue',
                    {id: randomId, value: filter, label: this.props.settingsComposition.filters[filter].title})
            })
        }

        const conditionsComposition = this.props.settingsComposition.conditions;
        const statsComposition = this.props.settingsComposition.stats;


        if(conditions && conditions.length) {
            let transformConditions = {}
            conditions.map(item => {
                const randomId = Date.now() + Math.random();
                transformConditions[randomId] = {
                    id: randomId,
                    metric: {
                        value: item[0],
                        label: conditionsComposition.columns[item[0]]
                    },
                    stats: {
                        value: item[1],
                        label: statsComposition[item[1]]
                    },
                    sign: {
                        value: item[2],
                        label: conditionsComposition.compareRules[item[2]]
                    },
                    fieldValue: item[3]
                }
            })
            this.props.changeSettings('conditions', transformConditions)
        }
    }

    handleSettingsOk = () => {
        this.props.loadTableData();
        this.props.handleSettingsShow();
    }

    handleSettingsClear = () => {
        this.props.changeSettings('groups', [])
        this.props.changeSettings('metric', null);
        this.props.changeSettings('pages', {
            limit: 30,
            offset: 0
        });
        this.props.changeSettings('sortOrder', null);
        this.props.changeSettings('filters', []);
        this.props.changeSettings('conditions', []);
        this.props.changeSettings('filtersGenerated', null);
    }

    render () {
        const { conditions, filtersGenerated } = this.props.settingsValues;

        const settingsFiltersLineBody = (filtersGenerated) ? Object.keys(filtersGenerated).map(function (item) {
            return <SettingsFiltersLine key={item} {...filtersGenerated[item]} />
        }) : null

        const conditionsBody = (conditions) ? Object.keys(conditions).map(function (item) {
            return <Condition key={item} {...conditions[item]} />
        }) : null

        return (
            <div style={{position: 'relative', zIndex: '2'}}>
                <SettingsMain />
                {settingsFiltersLineBody}
                <div style={{marginBottom: '10px'}}>
                    <span className="button button_content_settings-filter" onClick={this.props.addFilter}>
                        <i className="icon icon-plus"/>
                        Добавить фильтр
                    </span>
                </div>
                {conditionsBody}
                <div style={{marginBottom: '10px'}}>
                    <span className="button button_content_settings-condition" onClick={this.props.addCondition}>
                        <i className="icon icon-plus"/>
                        Добавить условие
                    </span>
                </div>

                <div style={{textAlign: 'center', marginBottom: '20px'}}>
                    <span className="button button_content_settings-remove" onClick={this.handleSettingsClear}>
                        <i className="icon icon-remove"/>
                        Очистить
                    </span>
                    <span className="button button_content_settings-ok" onClick={this.handleSettingsOk}>
                        <i className="icon icon-ok"/>
                        Применить
                    </span>
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    settingsValues: state.settingsValues,
    settingsComposition: state.settingsComposition,
}), { loadTableData, addCondition, changeSettings, addFilter, addFilterId, changeSettingsFilter})(Settings)