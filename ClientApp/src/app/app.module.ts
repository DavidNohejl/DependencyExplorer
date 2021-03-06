import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CytoscapeViewComponent } from './cytoscape-view/cytoscape-view.component';
import { D3ViewComponent } from './d3-view/d3-view.component';

@NgModule({
  declarations: [
    AppComponent,
    CytoscapeViewComponent,
    D3ViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
