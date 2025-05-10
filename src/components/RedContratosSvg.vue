<script setup>
import { onMounted } from 'vue'
import * as d3 from 'd3'

import data_red from '@/assets/datos/contrataciones_abiertas_red.json'
const tiempo_transicion = 300
onMounted(() => {
  // Dimensiones del svg
  const ancho = 800,
    alto = 800

  // Agregamos un svg
  const svg = d3.select('#my_dataviz').append('svg').attr('width', ancho).attr('height', alto)

  const grupo = svg
    .append('g') // y al svg le agregamos un grupo "g" posicionado en el centro
    .attr('transform', `translate(${ancho * 0.5}, ${alto * 0.5})`)

  const link = grupo
    .selectAll('line')
    .data(data_red.links)
    .enter()
    .append('line')
    .style('stroke', (d) =>
      d.peso_planeacion_monto < d.peso_ganador_monto ? '#4f0205' : '#022859',
    )
    .style('stroke-opacity', 0.2)
    .style('stroke-width', (d) => 0.001 * Math.sqrt(d.peso_planeacion_monto))

  const node = grupo
    .selectAll('circle')
    .data(data_red.nodes)
    .enter()
    .append('circle')
    .attr('r', (d) => 1 + 0.001 * Math.sqrt(+d.MONTO))
    .style('fill', (d) => (d.TIPO == 'PROVEDOR' ? '#047a5d' : '#bd4108'))
    .style('stroke', '#000')
    .attr('class', (d) => d.id)
  node
    .on('mouseover', (e, d) => {
      node.interrupt().transition().duration(tiempo_transicion).style('opacity', 0.3)
      link.interrupt().transition().duration(tiempo_transicion).style('stroke-opacity', 0)
      d3.selectAll('circle.' + d.id)
        .interrupt()
        .transition()
        .duration(tiempo_transicion)
        .style('opacity', 1)
      d3.selectAll('line.' + d.id)
        .each((dd) => {
          d3.selectAll('circle.' + dd.source.id)
            .interrupt()
            .transition()
            .duration(tiempo_transicion)
            .style('opacity', 1)
          d3.selectAll('circle.' + dd.target.id)
            .interrupt()
            .transition()
            .duration(tiempo_transicion)
            .style('opacity', 1)
        })
        .interrupt()
        .transition()
        .duration(tiempo_transicion)
        .style('stroke-opacity', 1)
    })
    .on('mouseout', () => {
      node.interrupt().transition().duration(tiempo_transicion).style('opacity', 1)
      link.transition().duration(tiempo_transicion).style('stroke-opacity', 0.3)
    })
  link.attr('class', (d) => {
    return d.source.id ? d.source.id + ' ' + d.target.id : d.source + ' ' + d.target
  })
  const simulation = d3
    .forceSimulation(data_red.nodes)
    .force(
      'link',
      d3
        .forceLink()
        .id((d) => d.id)
        .links(data_red.links),
    )
    .force('charge', d3.forceManyBody().strength(-30))
    .force(
      'collide',
      d3.forceCollide((d) => 2 + 0.001 * Math.sqrt(+d.MONTO)),
    )
    .force(
      'x',
      d3.forceX().strength((d) => (d.TIPO == 'PROVEDOR' ? -0.4 : 4)),
    )
    .force(
      'y',
      d3.forceY().strength((d) => (d.TIPO == 'PROVEDOR' ? -0.4 : 4)),
    )

    .on('tick', ticked)

  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    node
      .attr('cx', function (d) {
        var r = Math.sqrt(d.x * d.x + d.y * d.y)
        d.r = r
        var theta = Math.atan2(d.y, d.x)
        d.theta = theta
        if (d.TIPO == 'PROVEDOR') {
          if (d.r > ancho * 0.45) {
            d.r = ancho * 0.45
          } else if (d.r < ancho * 0.3) {
            d.r = ancho * 0.3
          }
        }
        d.x = d.r * Math.cos(d.theta)
        return d.x
      })
      .attr('cy', function (d) {
        if (d.TIPO == 'PROVEDOR') {
          if (d.r > ancho * 0.45) {
            d.r = ancho * 0.45
          } else if (d.r < ancho * 0.3) {
            d.r = ancho * 0.3
          }
        }
        d.y = d.r * Math.sin(d.theta)
        return d.y
      })
  }
})
</script>

<template>
  <div class="contenedor" id="my_dataviz"></div>
</template>

<style scoped></style>
