//TODO пудумать как переделать это узкое место
export function getURLOptionsSettings (obj) {
    const {groups, metric, dateTime, filters, pages, conditions, sortOrder} = obj
    let options = '';

    if(metric){
        options = options + `metric=${metric}&`
    }

    if(groups) {
        let str = `groups=`;
        groups.map((item) =>{
            str = str + `${item},`
        })
        str = str.slice(0, -1);
        options = options + str + `&`
    }

    if(dateTime) {

        if(dateTime['dateFrom'] && dateTime['datePeriod'] == 'other') {
            if(dateTime['dateTo']) {
                options = options + `dateFrom=${dateTime['dateFrom']}&dateTo=${dateTime['dateTo']}&`
            } else {
                options = options + `dateFrom=${dateTime['dateFrom']}&dateTo=${dateTime['dateFrom']}&`
            }
        }
        if(dateTime['timeZone'])  options = options + `timeZone=${dateTime['timeZone']}&`
        if(dateTime['groupsBy'])  options = options + `groupsBy=${dateTime['groupsBy']}&`
        if(dateTime['datePeriod'])  options = options + `datePeriod=${dateTime['datePeriod']}&`
    }


    var toString = {}.toString;

    if(filters && toString.call(filters) == '[object Object]') {
        //console.log(toString.call(filters));
        let i=0;
        let f = {};
        Object.keys(filters).map((key) => {
            if(!filters[key].length) {
                delete filters[key]
            } else {
                i = i + filters[key].length;
                f[key] = filters[key].map(item => {
                    if(toString.call(item) == '[object Object]') {
                        return item.value;
                    }
                    if(toString.call(item) == '[object String]') {
                        return item;
                    }
                    console.log(toString.call(item), item)
                })
            }
        });
        if(i > 0) {
            options = options + `filters=${encodeURIComponent(JSON.stringify(f))}&`
        }
    }

    if(conditions){

        const cond = [];

        if(Object.keys(conditions).length) {
            Object.keys(conditions).map(function (item) {
                if(conditions[item].metric && conditions[item].stats && conditions[item].sign && conditions[item].fieldValue) {
                    cond.push([conditions[item].metric.value, conditions[item].stats.value, conditions[item].sign.value, conditions[item].fieldValue])
                }
            })
        }

        if(conditions.length) {
            conditions.map(item=> {
                if(item[0] && item[1] && item[2]) {
                    cond.push(item)
                }
            })
        }

        if(Object.keys(cond).length || cond.length) options = options + `conditions=${encodeURIComponent(JSON.stringify(cond))}&`
    }

    if(sortOrder) {

        /*const key = Object.keys(sortOrder)[0];
        options = options + `sort=${key}.${sortOrder[key]}&`*/

        let str='';
        Object.keys(sortOrder).map(key => {
            str=str+`${key}.${sortOrder[key]}|`
        })
        str = str.slice(0, -1) + '&';
        options = options + `sort=`+str;
    }
    if(pages) {
        options = options + `limit=${pages.limit}&offset=${pages.offset}&`
    }


    options = options.slice(0, -1)

    history.pushState('', '', '?'+options);

    return options
}

export function transformObjForSelect( obj ) {
    return Object.keys(obj).map(function (key) {
        return {
            value: key,
            label: obj[key]
        }
    })
}

export function transformObjForSelectTag( obj ) {
    return Object.keys(obj).map(function (key) {
        return {
            value: obj[key],
            label: obj[key]
        }
    })
}

export function transformGroupsForSelect( groups ) {
    return Object.keys(groups).map(function (key) {
        return {
            value: key,
            label: groups[key].title
        }
    })
}


export function transformObjForStore( obj ) {
    if(obj == undefined || obj == null) return null
    if(!Array.isArray(obj)) return obj.value

    return obj.map(function (item) {
        return item.value
    })
}

export function nano(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (let i = 0, l = keys.length; i < l; _i++) v = v[this];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
};

export function unescapeHtml(safe) {
    return safe.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

export function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
