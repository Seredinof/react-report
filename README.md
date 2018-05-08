
В текущей реализации используем grid - https://github.com/facebook/fixed-data-table

## Варианты гридов
- https://github.com/schrodinger/fixed-data-table-2
- https://github.com/zippyui/react-datagrid
- https://github.com/glittershark/reactable
- https://github.com/facebook/fixed-data-table
- http://griddlegriddle.github.io/Griddle/
- https://www.ag-grid.com/example.php (https://www.ag-grid.com/best-react-data-grid/index.php) - Эпичный грид, даже есть drag&drop о котором мечтаеют юзеры. Но на гитхабе именно в react исполнении звезд мало.
- http://adazzle.github.io/react-data-grid/ - пока не сбрасываем со счетов

### Установка

```
npm install
```

### Запуск вебпака с хот-миддлом (для работы без перезагрузки страницы) и json сервером.

```
npm start
```


JSON сервер (https://github.com/typicode/json-server) позволяет имитировать все CRUD над json файлом, это сделано для имитации бэкэнда.
Можно осуществлять поиск, фильтрацию, пагинацию и прочее.

Пока будем разрабатывать без бэкенда, главное знать структуру json.
Сам файл json находится в json/data.json. Там выгружены некоторые данные из aggregate_event_fact.


### Реквизиты

http://localhost:3000/  - сервер разработки
http://localhost:3001/ - JSON сервер 

