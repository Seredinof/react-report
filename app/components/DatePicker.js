import React, {
    Component,
    PropTypes,
} from 'react';
import moment from 'moment';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import YearMonthForm from './YearMonthForm'
import {connect} from 'react-redux'
import { changeSettingsDate } from '../AC/settings'
import { loadTableData } from '../AC/tableData'

import 'react-day-picker/lib/style.css';

import 'moment/locale/ru';

const overlayStyle = {
    position: 'absolute',
    background: 'white',
    boxShadow: '0 2px 5px rgba(0, 0, 0, .15)',
    zIndex: '2',
    padding: '10px 0',
    width: '750px',
    boxSizing: 'border-box'
};

const today = new Date();
const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
const last7Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
const last30Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29);
const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
const previousMonthFrom = new Date(today.getFullYear(), today.getMonth() - 1);
const previousMonthTo = new Date(today.getFullYear(), today.getMonth(), 0);

class DatePicker extends Component {

    state = {
        locale: 'ru',
        monthFrom: new Date(this.props.settingsValuesDateTime.dateFrom) || today,
        monthTo: new Date(this.props.settingsValuesDateTime.dateTo) || today,
        showOverlay: false,
    };

    componentWillUnmount() {
        clearTimeout(this.clickTimeout);
    }

    input = null;
    clickedInside = false;
    clickTimeout = null;
    intervals = {
        today: {
            from: today,
            to: today,
            text: 'За сегодня'
        },
        yesterday: {
            from: yesterday,
            to: yesterday,
            text: 'За вчера'
        },
        last_7_days: {
            from: last7Days,
            to: today,
            text: 'За последние 7 дней'
        },
        last_30_days: {
            from: last30Days,
            to: today,
            text: 'За последние 30 дней'
        },
        current_month: {
            from: currentMonth,
            to: today,
            text: 'За этот месяц'
        },
        previous_month: {
            from: previousMonthFrom,
            to: previousMonthTo,
            text: 'За предыдущий месяц'
        },
        other: {
            from: new Date(this.props.settingsValuesDateTime.dateFrom) || today,
            to: new Date(this.props.settingsValuesDateTime.dateTo) || today,
            text: 'Другой диапазон'
        }
    };

    handleContainerMouseDown = () => {
        this.clickedInside = true;
        // The input's onBlur method is called from a queue right after onMouseDown event.
        // setTimeout adds another callback in the queue, but is called later than onBlur event
        this.clickTimeout = setTimeout(() => {
            this.clickedInside = false;
        }, 0);
    };

    handleInputFocus = () => {
        this.setState({
            showOverlay: true,
        });
    };

    handleInputBlur = () => {
        const showOverlay = this.clickedInside;

        this.setState({
            showOverlay,
        });

        // Force input's focus if blur event was caused by clicking on the calendar
        if (showOverlay) {
            this.input.focus();
        }
    };

    handleInputChange = e => {

    };

    handleDayClickFrom = (day) => {
        const to = new Date(this.props.settingsValuesDateTime.dateTo);
        const groupsBy = this.props.settingsValuesDateTime.groupsBy;
        const limitRange = this.limitRange(groupsBy);
        if(to != null && day > to) {

            this.props.changeSettingsDate({
                dateFrom: moment(day).format('YYYY-MM-DD'),
                dateTo: moment(day).format('YYYY-MM-DD'),
                datePeriod: 'other'
            });

            this.setState({
                monthTo: day,
            });

        } else {

            if(day < new Date(+to - limitRange)) return false;

            this.props.changeSettingsDate({
                dateFrom: moment(day).format('YYYY-MM-DD'),
                datePeriod: 'other'
            });
        }
    };

    handleDayClickTo = ( day) => {
        const from = new Date(this.props.settingsValuesDateTime.dateFrom);
        const groupsBy = this.props.settingsValuesDateTime.groupsBy;
        const limitRange = this.limitRange(groupsBy);

        //console.log(limitRange, new Date(+from + limitRange),  day > new Date(+from + limitRange))

        if(from != null && day < from || day > new Date(+from + limitRange)) return false;

        this.props.changeSettingsDate({
            dateTo: moment(day).format('YYYY-MM-DD'),
            datePeriod: 'other'
        });
    };

    handleInitialMonthFrom = month => {
        this.setState({ monthFrom: month })
    }

    handleInitialMonthTo = month => {
        this.setState({ monthTo: month })
    }

    handleSelectRange = (range) => (ev) => {

        const {from, to, interval} = range;

        this.setState({
            monthFrom: from,
            monthTo: to,
        });

        this.props.changeSettingsDate({
            dateFrom: moment(from).format('YYYY-MM-DD'),
            dateTo: moment(to).format('YYYY-MM-DD'),
            datePeriod: interval
        });
    }

    handleSelectTimeZones = () =>{
        this.props.changeSettingsDate({
            timeZone: this.selectTimeZone.value
        });
    }

    handleSelectGroupsBy = () =>{
        const to = new Date(this.props.settingsValuesDateTime.dateTo);

        if(this.selectGroupsBy.value == 'hour') {

            this.props.changeSettingsDate({
                dateFrom: moment(to).format('YYYY-MM-DD'),
                dateTo: moment(to).format('YYYY-MM-DD'),
                datePeriod: 'other',
                groupsBy: this.selectGroupsBy.value
            });

            this.setState({
                monthFrom: to,
                monthTo: to,
            });

            return false;
        }

        this.props.changeSettingsDate({
            groupsBy: this.selectGroupsBy.value
        });
    }
    handleOk = () => {

        this.input.blur();
        this.clickedInside = false;
        this.clickTimeout = null;
        this.setState({
            showOverlay: false
        });

        if(this.props.loadData) {
            this.props.loadTableData();
        }
    }
    handleClear = () => {
        this.props.changeSettingsDate({
            dateFrom: moment(today).format('YYYY-MM-DD'),
            dateTo: moment(today).format('YYYY-MM-DD'),
            datePeriod: 'today',
            groupsBy: 'day'
        });

        this.setState({
            monthFrom: today,
            monthTo: today,
        });
    }

    limitRange = (groupsBy) => {
        let limitValue;

        switch (groupsBy) {
            case 'hour':
                limitValue = 1000*60*60;
                break;
            case 'day':
                limitValue = 1000*60*60*24;
                break;
            case 'week':
                limitValue = 1000*60*60*24*7;
                break;
            case 'month':
                limitValue = 1000*60*60*24*30;
                break;
            case 'year':
                limitValue = 1000*60*60*24*365;
                break;
        }
        return (limitValue*60);
    }

    render() {

        const {locale} = this.state;
        const {settingsCompositionDateTime, settingsValuesDateTime} = this.props;
        const dateFrom = new Date(settingsValuesDateTime.dateFrom);
        const dateTo = new Date(settingsValuesDateTime.dateTo);
        const groupsBy = settingsValuesDateTime.groupsBy;
        const limitRange = this.limitRange(groupsBy);

        let valueInput = moment(dateFrom).format('L')+ ' - ' + moment(dateTo).format('L');

        if(moment(dateFrom, 'L', true).isValid()){
            valueInput = moment(dateFrom).format('L');
            if(moment(dateTo, 'L', true).isValid()) {
                valueInput = valueInput + ' - ' + moment(dateTo).format('L');
            }
        } else {
            valueInput = '';
        }

        return (
            <div onMouseDown={this.handleContainerMouseDown} className="b-date-picker">
                <input
                    className="field field_content_datepicker"
                    type="text"
                    ref={el => {
                        this.input = el;
                    }}
                    value={ valueInput }
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                />
                {this.state.showOverlay &&
                <div style={{ position: 'relative' }}>
                    <div style={overlayStyle}>
                        <div className="container-fluid">
                            <div className="flex-row">
                                <div className="col-md-3">
                                    <ul className="date-picker-menu">
                                        {
                                            Object.keys(this.intervals).map( interval => {
                                                if(groupsBy == 'hour' &&
                                                    (interval == 'last_7_days' || interval == 'last_30_days' ||
                                                    interval == 'current_month' || interval == 'previous_month' )) return false;
                                                return <li key={interval}
                                                           className={`date-picker-menu__item ${settingsValuesDateTime.datePeriod == interval ? 'date-picker-menu__item_active': null}`}
                                                           onClick={this.handleSelectRange({...this.intervals[interval], interval})}>{this.intervals[interval].text}</li>
                                            } )
                                        }
                                    </ul>
                                </div>
                                <div className="col-md-4">
                                    <DayPicker
                                        initialMonth={dateFrom || undefined}
                                        onDayClick={this.handleDayClickFrom}
                                        selectedDays={[dateFrom, { from: dateFrom, to: dateTo }]}
                                        locale={locale}
                                        localeUtils={MomentLocaleUtils}
                                        month={this.state.monthFrom}
                                        disabledDays={day => dateTo ? (day < new Date(+dateTo - limitRange)) : false}
                                        captionElement={
                                            <YearMonthForm onChange={this.handleInitialMonthFrom} locale={this.state.locale} localeUtils={ MomentLocaleUtils }/>
                                        }
                                    />
                                </div>
                                <div className="col-md-4">
                                    <DayPicker
                                        initialMonth={dateTo || undefined}
                                        onDayClick={this.handleDayClickTo}
                                        selectedDays={[dateTo, { from: dateFrom, to: dateTo }]}
                                        locale={locale}
                                        localeUtils={MomentLocaleUtils}
                                        month={this.state.monthTo}
                                        disabledDays={day => dateFrom ? (day < dateFrom || day > new Date(+dateFrom + limitRange)) : false}
                                        captionElement={
                                            <YearMonthForm onChange={this.handleInitialMonthTo} locale={this.state.locale} localeUtils={ MomentLocaleUtils }/>
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex-row">
                                <div className="col-md-6">
                                    <select value={settingsValuesDateTime.timeZone} ref={(select) => this.selectTimeZone = select} onChange={this.handleSelectTimeZones}>
                                        {
                                            Object.keys(settingsCompositionDateTime.timeZones).map(zone => {
                                                return <option key={zone} value={zone} selected={settingsValuesDateTime.timeZone == zone} >{settingsCompositionDateTime.timeZones[zone]}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <select value={settingsValuesDateTime.groupsBy} ref={(select) => this.selectGroupsBy = select} onChange={this.handleSelectGroupsBy}>
                                        {
                                            Object.keys(settingsCompositionDateTime.groupsBy).map(group => {
                                                return <option key={group} value={group} selected={settingsValuesDateTime.groupsBy == group} >{settingsCompositionDateTime.groupsBy[group]}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="flex-row" style={{marginTop: '10px'}}>
                                <div className="col-xxs-12">
                                    <span className="button button_content_settings-ok" onClick={this.handleOk}>
                                        <i className="icon icon-ok"/>
                                        Применить
                                    </span>
                                    <span style={{marginLeft: '10px'}} className="button button_content_settings-remove" onClick={this.handleClear}>
                                        <i className="icon icon-remove"/>
                                        Сбросить
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
    }
}

DatePicker.propTypes = {};
DatePicker.defaultProps = {};

export default connect(state => ({
    settingsValuesDateTime: state.settingsValues.dateTime,
    settingsCompositionDateTime: state.settingsComposition.dateTime
}), { changeSettingsDate, loadTableData })(DatePicker)
