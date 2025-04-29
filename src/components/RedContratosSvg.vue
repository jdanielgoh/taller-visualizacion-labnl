<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'

import data_red from '@/assets/datos/contrataciones_abiertas_red.json'
onMounted(() => {
  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = d3
    .select('#my_dataviz')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left + width * 0.5}, ${margin.top + height * 0.5})`)

  const link = svg
    .selectAll('line')
    .data(data_red.links)
    .join('line')
    .style('stroke', (d) =>
      d.peso_planeacion_monto < d.peso_ganador_monto ? '#4f0205' : '#022859',
    )
    .style('stroke-opacity', 0.2)
    .style('stroke-width', (d) => 0.001 * Math.sqrt(d.peso_planeacion_monto))

  const node = svg
    .selectAll('circle')
    .data(data_red.nodes)
    .join('circle')
    .attr('r', (d) => 1 + 0.001 * Math.sqrt(+d.MONTO))
    .style('fill', (d) => (d.TIPO == 'PROVEDOR' ? '#047a5d' : '#bd4108'))
    .style('stroke', '#000')
    .attr('class', (d) => d.id)
  node
    .on('mouseover', (e, d) => {
      node.style('opacity', 0.3)
      link.style('stroke-opacity', 0)
      d3.selectAll('circle.' + d.id).style('opacity', 1)
      d3.selectAll('line.' + d.id)
        .style('stroke-opacity', 1)
        .each((dd) => {
          d3.selectAll('circle.' + dd.source.id).style('opacity', 1)
          d3.selectAll('circle.' + dd.target.id).style('opacity', 1)
        })
    })
    .on('mouseout', () => {
      node.style('opacity', 1)
      link.style('stroke-opacity', 0.3)
    })
  link.attr('class', (d) => {
    console.log(d)
    return d.source.id + ' ' + d.target.id
  })
  // Let's list the force we wanna apply on the network
  const simulation = d3
    .forceSimulation(data_red.nodes) // Force algorithm is applied to data.nodes
    .force(
      'link',
      d3
        .forceLink() // This force provides links between nodes
        .id(function (d) {
          return d.id
        })

        // This provide  the id of a node
        .links(data_red.links), // and this the list of links
    )

    .force('charge', d3.forceManyBody().strength(-5)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force(
      'collide',
      d3.forceCollide((d) => 2 + 0.001 * Math.sqrt(+d.MONTO)),
    )
    .force(
      'x',
      d3.forceX().strength((d) => (d.TIPO == 'PROVEDOR' ? -0.4 : 6)),
    )
    .force(
      'y',
      d3.forceY().strength((d) => (d.TIPO == 'PROVEDOR' ? -0.4 : 6)),
    )

    .on('tick', ticked)

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr('x1', function (d) {
        return d.source.x
      })
      .attr('y1', function (d) {
        return d.source.y
      })
      .attr('x2', function (d) {
        return d.target.x
      })
      .attr('y2', function (d) {
        return d.target.y
      })

    node
      .attr('cx', function (d) {
        var r = Math.sqrt(d.x * d.x + d.y * d.y)
        d.r = r
        var theta = Math.atan2(d.y, d.x)
        d.theta = theta
        if (d.TIPO == 'PROVEDOR') {
          if (d.r > width * 0.45) {
            d.r = width * 0.45
          } else if (d.r < width * 0.3) {
            d.r = width * 0.3
          }
        }
        d.x = d.r * Math.cos(d.theta)
        return d.x
      })
      .attr('cy', function (d) {
        if (d.TIPO == 'PROVEDOR') {
          if (d.r > width * 0.45) {
            d.r = width * 0.45
          } else if (d.r < width * 0.3) {
            d.r = width * 0.3
          }
        }
        d.y = d.r * Math.sin(d.theta)
        return d.y
      })
  }
})
console.log(data_red)
</script>

<template>
  <div class="contenedor" id="my_dataviz"></div>
</template>

<style scoped></style>
