import axios from 'axios';
import { unescapeHtml } from '../store/helpers'

export function getOptions(url){
    return function (q) {
        if (!q) {
            return Promise.resolve({ options: [] });
        }
        return axios.get(url+'?q='+q)
            .then(response => {
                return {options: response.data.map(function (item) {
                    return {
                        label: unescapeHtml(item.title),
                        value: item.id
                    }
                })}
            });
    }
}