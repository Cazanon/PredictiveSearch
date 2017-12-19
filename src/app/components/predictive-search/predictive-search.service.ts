import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs/Observable';

@Injectable()
export class WebSearchService {

  constructor(private http: HttpClient, private endpoint: string) { }

  public search(params: HttpParams): Observable<any> {
    return this.http.get(this.endpoint, { params: params }).map(res => {
      return res;
    });
  }

}
