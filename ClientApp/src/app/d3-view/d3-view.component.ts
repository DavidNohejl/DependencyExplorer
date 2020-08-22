import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

class Node implements SimulationNodeDatum {
  public x: number;
  public y: number;
  constructor(public id: number) { }
}

class Link implements SimulationLinkDatum<Node> {
  constructor(public source: Node, public target: Node) { }
}

interface Graph {
  nodes: Node[];
  links: Link[];
}
@Component({
  selector: 'app-d3-view',
  templateUrl: './d3-view.component.html',
  styleUrls: ['./d3-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class D3ViewComponent implements OnInit {
  svg: any;
  graph: any;
  simulation: any;// d3.Simulation<Node,Link>;
  node: any;
  link: any;
  forceProperties: any = {
    center: {
      x: 0.5,
      y: 0.5
    },
    charge: {
      enabled: true,
      strength: -500,
      distanceMin: 1,
      distanceMax: 2000
    },
    collide: {
      enabled: true,
      strength: .7,
      iterations: 1,
      radius: 35
    },
    forceX: {
      enabled: true,
      strength: 0.05,
      x: 0.5
    },
    forceY: {
      enabled: true,
      strength: 0.35,
      y: 0.5
    },
    link: {
      enabled: true,
      distance: 100,
      iterations: 1
    }
  };
  width: any;
  height: any;
  data: any;

  initializeDisplay() {
    // set the data and properties of link lines
    this.link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.graph.links)
      .enter().append("line");

    // set the data and properties of node circles
    this.node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(this.graph.nodes)
      .enter().append("circle")
      .call(d3.drag()
        .on("start", (d: any) => {
          if (!d3.event.active) if (this.simulation) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (d: any) => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", (d: any) => {
          if (!d3.event.active) if (this.simulation) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // node tooltip
    this.node.append("title")
      .text(function (d) {
        console.log(d);
        return d.id;
         });
    // visualize the graph
    this.updateDisplay();
  }

  updateDisplay() {
    this.node
      .attr("r", this.forceProperties.collide.radius)
      .attr("stroke", this.forceProperties.charge.strength > 0 ? "blue" : "red")
      .attr("stroke-width", this.forceProperties.charge.enabled == false ? 0 : Math.abs(this.forceProperties.charge.strength) / 15);

    this.link
      .attr("stroke-width", this.forceProperties.link.enabled ? 1 : .5)
      .attr("opacity", this.forceProperties.link.enabled ? 1 : 0);
  }

  // apply new force properties
  updateForces() {
    // get each force by name and update the properties
    this.simulation.force("center")
      .x(this.width * this.forceProperties.center.x)
      .y(this.height * this.forceProperties.center.y);
    this.simulation.force("charge")
      .strength(this.forceProperties.charge.strength * this.forceProperties.charge.enabled)
      .distanceMin(this.forceProperties.charge.distanceMin)
      .distanceMax(this.forceProperties.charge.distanceMax);
    this.simulation.force("collide")
      .strength(this.forceProperties.collide.strength * this.forceProperties.collide.enabled)
      .radius(this.forceProperties.collide.radius)
      .iterations(this.forceProperties.collide.iterations);
    this.simulation.force("forceX")
      .strength(this.forceProperties.forceX.strength * this.forceProperties.forceX.enabled)
      .x(this.width * this.forceProperties.forceX.x);
    this.simulation.force("forceY")
      .strength(this.forceProperties.forceY.strength * this.forceProperties.forceY.enabled)
      .y(this.height * this.forceProperties.forceY.y);

    this.simulation.force("link")
    .id(function(d) {return d.id;})
      .distance(this.forceProperties.link.distance)
      .iterations(this.forceProperties.link.iterations)
      .links(this.forceProperties.link.enabled ? this.graph.links : []);

    // updates ignored until this is run
    // restarts the simulation (important if simulation has already slowed down)
    this.simulation.alpha(1).restart();
  }

  initializeSimulation() {
    this.simulation.nodes(this.graph.nodes);
    this.initializeForces();
    this.simulation.on("tick", () => {
      this.link
        .attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });

      this.node
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
    });
  }

  initializeForces() {
    // add forces and associate each with a name
    this.simulation
      .force("link", d3.forceLink())
      .force("charge", d3.forceManyBody())
      .force("collide", d3.forceCollide())
      .force("center", d3.forceCenter())
      .force("forceX", d3.forceX())
      .force("forceY", d3.forceY());
    // apply properties to each of the forces
    this.updateForces();
  }

  ngOnInit() {

    this.svg = d3.select('svg');

    this.width = this.svg.node().getBoundingClientRect().width,
      this.height = this.svg.node().getBoundingClientRect().height;

    this.simulation = d3.forceSimulation();

    d3.json('./assets/miserables.json').then((graph: Graph) => {

      this.graph = graph;
      this.initializeDisplay();
      this.initializeSimulation();

    }).catch(error => {
      console.error('Cannot proceed with simulation, failed to  retrieve data.')
    });
  }
}
