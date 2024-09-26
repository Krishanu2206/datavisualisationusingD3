import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data, selectedsource) => {

  return data.reduce((acc, item) => {
    if(item.source === selectedsource && item.topic != ""){
    if (acc[item.topic]) {
      acc[item.topic] += 1;
    } else {
      acc[item.topic] = 1;
    }}
    return acc;
  }, {});
};

const PieChartOfSourceWiseCountry = ({ data, selectedsource}) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData = aggregateData(data, selectedsource);

      const topics = Object.keys(aggregatedData);
      // Calculate average relevance for each source
      const counts = Object.values(aggregatedData);

      // Set dimensions and margins for the SVG
      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2;

      // Clear previous contents of the SVG element
      const svg = d3.select(d3Container.current);
      svg.selectAll('*').remove();

      // Create a group element to hold the pie chart
      const g = svg.append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      // Generate the pie chart
      const pie = d3.pie().value(d => d)(counts);
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      // Define color scale
      const color = d3.scaleOrdinal()
        .domain(topics)
        .range(d3.schemeCategory10);

      // Create pie chart slices
      g.selectAll('path')
        .data(pie)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(topics[i]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .on('mouseover', function(event, d) {
          const topic = topics[d.index];
          const count = counts[d.index];
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '0.85');
          g.append('text')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(topic);
          // Added this line to display average relevance in tooltip
          g.append('text')
            .attr('class', 'tooltip2')
            .attr('transform', `translate(${arc.centroid(d)} - 10)`)
            .attr('dy', '0.5em')
            .style('text-anchor', 'middle')
            .style('font-size', '20px')
            .text(`Count : ${count}`);  // Format to 2 decimal places
        })
        .on('mouseout', function() {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
          g.select('.tooltip').remove();
          g.select('.tooltip2').remove();
        });
    }
  }, [data, selectedsource]);

  return (
    <svg
      ref={d3Container}
      width={400}
      height={400}
    />
  );
};

export default PieChartOfSourceWiseCountry;
