import React, {
    Component,
    PropTypes,
} from 'react';
import Select from 'react-select'
import { connect } from 'react-redux'
import { changeSettingsCondition, deleteSettingsCondition } from '../AC/settings'
import { transformObjForSelect } from '../store/helpers'

class Condition extends Component {

    updateValue = (id, field) => (value) => {
        //console.log(id, field, value)
        if(field == 'fieldValue') {
            this.props.changeSettingsCondition(id, field, value.target.value)
            return;
        }
        this.props.changeSettingsCondition(id, field, value)
    }

    handleDelete = (id) => () => {
        this.props.deleteSettingsCondition(id)
    }

    render() {
        const {id, metric, sign, fieldValue, stats} = this.props
        //console.log(id, metric, sign);
        return (
            <div>
                <div className="flex-row">
                    <div className="col-xs-12 col-sm-4 col-md-3">
                        <label>Значение за период</label>
                        <Select className="settings__item" options={transformObjForSelect(this.props.settingsComposition.conditions.columns)} placeholder="Значение за период"
                                value={metric} onChange={this.updateValue(id, 'metric')}
                                noResultsText = 'Результатов не найдено'
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-3">
                        <label>Показатель</label>
                        <Select className="settings__item" options={this.props.settingsCompositionStats} placeholder="Показатель"
                                value={stats} onChange={this.updateValue(id, 'stats')}
                                noResultsText = 'Результатов не найдено'
                        />
                    </div>
                    <div className="col-xs-12 col-sm-2 col-md-1">
                        <label>Знак</label>
                        <Select className="settings__item" options={transformObjForSelect(this.props.settingsComposition.conditions.compareRules)} placeholder="Знак сравнения"
                                value={sign} onChange={this.updateValue(id, 'sign')}
                                noResultsText = 'Результатов не найдено'
                        />
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-2">
                        <label>Значение</label>
                        <input type="text" value={fieldValue} className="field field_content_condition" placeholder="Значение" onChange={this.updateValue(id, 'fieldValue')}/>
                    </div>
                    <div className="col-xs-12 col-sm-2 col-md-3">
                        <label>&nbsp;</label>
                        <span className="button button_content_settings-condition-del" onClick={this.handleDelete(id)}><i className="icon icon-remove"/> Удалить</span>
                    </div>
                </div>
            </div>
        );
    }
}

Condition.propTypes = {};
Condition.defaultProps = {};

export default connect(state => ({
    settingsValues: state.settingsValues,
    settingsComposition: state.settingsComposition,
    settingsCompositionStats: transformObjForSelect(state.settingsComposition.stats)
}), {changeSettingsCondition, deleteSettingsCondition})(Condition);

