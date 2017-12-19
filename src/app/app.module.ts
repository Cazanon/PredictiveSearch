import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';

import { PredictiveSearchComponent } from './components/predictive-search/predictive-search.component';
import { WebSearchService } from './components/predictive-search/predictive-search.service';

@NgModule({
  declarations: [
    AppComponent,
    PredictiveSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule
  ],
  exports: [
    PredictiveSearchComponent
  ],
  providers: [WebSearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
