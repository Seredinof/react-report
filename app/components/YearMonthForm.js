import React from 'react'

const currentYear = (new Date()).getFullYear();
const fromMonth = new Date(currentYear - 10, 0, 1, 0, 0);
const toMonth = new Date(currentYear + 3, 11, 31, 23, 59);

export  default function YearMonthForm({ date, localeUtils, onChange, locale }) {
    const months = localeUtils.getMonths(locale);
    const years = [];
    for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i++) {
        years.push(i);
    }

    const handleChange = function handleChange(e) {
        const { year, month } = e.target.form;
        onChange(new Date(year.value, month.value));
    };

    return (
        <form className="DayPicker-Caption">
            <select name="month" onChange={ handleChange } value={ date.getMonth() }>
                { months.map((month, i) =>
                    <option key={ i } value={ i }>
                        { month }
                    </option>)
                }
            </select>
            <select name="year" onChange={ handleChange } value={ date.getFullYear() }>
                { years.map((year, i) =>
                    <option key={ i } value={ year }>
                        { year }
                    </option>)
                }
            </select>
        </form>
    );
}
