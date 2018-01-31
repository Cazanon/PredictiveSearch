
# predictive-search

## Input search

By property it can be converted into predictive (it shows results while user is typing (default option)) or the search only works when user press button "search".

Show the results in the list. When an item is selected, it is notified up with the selected item and the search made is deleted, with one item selected.

When text is re-entered in the input, the search is restarted and the selected item will be empty. In addition component throw an event to indicate the search status has been restarted.


## Propiedades

| Name | Definition | Input params (default value)
| -------| ---------- | ----------------------------------
| serviceName | name of service to use |```string```
| queryParamName | name of param for service |```string```
| placeholder | input placeholder |```string```
| showProperties | properties of returned object from service to show in results list |``` Array<string>```
| minLength | min length to launch search (predictive) |```number``` (1)
| predictive | predictive search or button search |```boolean``` (true)
| debounceTime | time between typing (predictive) |```number``` (500)
| totalResultsText | text to show in results | ```string```
| searchButtonText | text to show in search button  | ```string```

## Events

| Name | Definition | Output
| -------| ---------- | ------
| reset | notify when search restart | null
| onSelect | notify when search result is selected | selected object (like recieve from service)


## Example of use

  ```html 
      <app-predictive-search  class="predictive-search"
                      serviceName="http://localhost:3000/countries"
                      queryParamName="q"
                      placeholder="Search Country"
                      totalResultsText="Results"
                      searchButtonText="Search" 
                      [showProperties]="['name']"
                      [predictive]="true" 
                      (onSelect)="selectItem($event)"
                      (reset)="restoreSelection()">
      </app-predictive-search>
  ```
