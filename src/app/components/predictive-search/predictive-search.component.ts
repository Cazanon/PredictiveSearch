import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { WebSearchService } from './predictive-search.service';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';


@Component({
  selector: 'app-predictive-search',
  templateUrl: './predictive-search.component.html',
  styleUrls: ['./predictive-search.component.scss']
})
export class PredictiveSearchComponent implements OnInit, OnDestroy {

  /**
   * service name to call
   */
  @Input() serviceName: string;

  /**
   * param name of query string for service
   */
  @Input() queryParamName: string;

  /**
   * placeholder of input
   */
  @Input() placeholder: string;

  /**
   * properties for show in list from object that service return
   */
  @Input() showProperties: Array<string>;

  /**
   * min length to do call service (predictive)
   */
  @Input() minLength = 1;

  /**
   * predictive search or button
   */
  @Input() predictive = true;

  /**
   * time between keyboard types in ms (predictive)
   */
  @Input() debounceTime = 500;

  /**
   * text to show in results span
   */
  @Input() totalResultsText: string;

  /**
   * text to show in button search (non predictive)
   */
  @Input() searchButtonText: string;

  /**
   * Notify when search restart
   */
  @Output() public reset: EventEmitter<any> = new EventEmitter();

  /**
   * Notify when select a result item
   */
  @Output() public onSelect: EventEmitter<any> = new EventEmitter();

  /**
   * Input model
   */
  public query: string;

  /**
   * Item list to show
   */
  public listResults: Array<any>;

  /**
   * Selected Item
   */
  public selectedItem: any;

  /**
   * Error handler to show a message
   */
  public searchError = false;

  /**
   * Service results
   */
  private results: Array<any>;

  /**
   * Data stream for keyup event
   */
  private inputString = new Subject<any>();

  /**
   * General service to search
   */
  private webSearchService: WebSearchService;

  /**
   * Contains last call to service (predictive)
   */
  private queryUsed: any;

  constructor(
    private httpClient: HttpClient,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.webSearchService = new WebSearchService(this.httpClient, this.serviceName);
    if (this.predictive) { this.initListenInputString(); }
  }

  ngOnDestroy() {
    this.inputString.unsubscribe();
  }

  /**
   * Call service to get data
   * @param terms query to search
   */
  public searchStatic(terms: string): void {
    terms = terms.trim();
    if (!terms || terms.length === 0) { return; }
    if (this.selectedItem) {
      this.reset.emit(null);
      this.selectedItem = null;
    }
    const params = new HttpParams({
      fromString: `${this.queryParamName}=${terms}`
    });
    params.append(this.queryParamName, terms);
    this.webSearchService.search(params).subscribe(
      results => {
        this.results = results;
        this.listResults = this.normalizeResults(results, terms);
      },
      error => {
        this.searchError = true;
        this.results = null;
        this.listResults = null;
      });
  }

  /**
   * Update string data for service call
   * @param terms query
   */
  public searchPredictive(terms: string): void {
    if (this.predictive && this.selectedItem) {
      this.reset.emit(null);
      this.queryUsed = null;
      this.selectedItem = null;
    }
    if (!this.predictive && this.searchError) { this.searchError = false; }
    terms = terms.trim();
    this.inputString.next(terms);
  }

  /**
   * Filter by minLength, else remove old data results
   * and manage dont make calls if last request hasnt got data.
   * Call service and handle response
   */
  private initListenInputString(): void {
    this.inputString
      .debounceTime(this.debounceTime)
      .distinctUntilChanged()
      .filter(query => query && query.length >= this.minLength ? true : this.listResults = null)
      .filter(query => {
        if (!this.queryUsed || query.length <= this.queryUsed.length || this.queryUsed.results > 0) { return true; }
        if (query.length > this.queryUsed.length && this.queryUsed.results < 1) { return false; }
      })
      .switchMap(terms => {
        const params = new HttpParams({
          fromString: `${this.queryParamName}=${terms}`
        });
        params.append(this.queryParamName, terms);
        return this.webSearchService
          .search(params)
          .map(
          results => {
            this.results = results;
            this.listResults = this.normalizeResults(results, terms);
            this.queryUsed = { length: terms.length, results: results.length };
          })
          .catch(error => {
            this.searchError = true;
            this.results = null;
            this.listResults = null;
            return Observable.of(error);
          });
      })
      .subscribe();
  }

  /**
   * Return results with query in bold
   * @param results Items service return
   * @param terms query to highlight
   */
  private normalizeResults(results: Array<any>, terms: string): Array<any> {
    terms = terms.toLowerCase();
    return results.map(result => {
      let auxString = '';
      this.showProperties.forEach(property => {
        if (result[property]) {
          auxString += `<span>${this.hightlightString(result[property], terms)}</span>`;
        }
      });
      return this._sanitizer.bypassSecurityTrustHtml(auxString);
    });
  }

  /**
   * Find query string into other and put <b> between
   * @param str string for search
   * @param term query to find
   */
  private hightlightString(str: string, term: string): string {
    const indx = str.toLowerCase().indexOf(term.toLocaleLowerCase());
    if (str === '' || indx === -1) { return str; }
    const backupSubStr = str.slice(indx + term.length);
    return `${str.substring(0, indx)}<b>${str.substring(indx, indx + term.length)}</b>${this.hightlightString(backupSubStr, term)}`;
  };

  /**
   * Select an item, notify them and remove results list
   * @param index idx of selected Item
   */
  public selectItem(index: number): void {
    this.selectedItem = this.listResults[index];
    this.listResults = null;
    this.query = '';
    this.onSelect.emit(this.results[index]);
  }
}
