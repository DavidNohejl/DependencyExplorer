import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CytoscapeViewComponent } from './cytoscape-view/cytoscape-view.component';
import { D3ViewComponent } from './d3-view/d3-view.component';

const routes: Routes = [
  { path: 'cytoscape-view', component: CytoscapeViewComponent },
  { path: 'd3-view', component: D3ViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
