import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const sectorsOfInterest = [
    "Manufacturing", "Financial services", "Energy", "Retail",
    "Information Technology", "Support services", "Government", "Aerospace & Defence"
  ];

  return data.reduce((acc, item) => {
    const sector = sectorsOfInterest.includes(item.sector) ? item.sector : "Others";
    if (acc[sector]) {
      acc[sector].total += item.relevance;  // Assuming 'relevance' is a numeric value
      acc[sector].count += 1;
    } else {
      acc[sector] = { total: item.relevance, count: 1 };
    }
    return acc;
  }, {});
};

const PieChartOfRelevanceAndSector = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData = aggregateData(data);

      const sectors = Object.keys(aggregatedData);

      // Calculate average relevance for each sector
      const relevances = Object.values(aggregatedData).map(sectorData => sectorData.total / (sectorData.count || 1)); // Handle potential missing 'count' property

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
      const pie = d3.pie().value(d => d)(relevances);
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      // Define color scale
      const color = d3.scaleOrdinal()
        .domain(sectors)
        .range(d3.schemeCategory10);

      // Create pie chart slices
      g.selectAll('path')
        .data(pie)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(sectors[i]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .on('mouseover', function(event, d) {
          const sector = sectors[d.index];
          const relevance = relevances[d.index];
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '0.85');
          g.append('text')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${arc.centroid(d)})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(sector);
          // Added line to display average relevance in tooltip
          g.append('text')
            .attr('class', 'tooltip2')
            .attr('transform', `translate(${arc.centroid(d)} - 10)`)
            .attr('dy', '0.5em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`Avg. Relevance: ${relevance.toFixed(2)}`);
        })
        .on('mouseout', function() {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1');
          g.select('.tooltip').remove();
          g.select('.tooltip2').remove();
        });
    }
  }, [data]);

  return (
    <>
    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Sector and Relevance Piechart</h2>
    <svg
      ref={d3Container}
      width={400}
      height={400}
    />
    </>
  );
};

export default PieChartOfRelevanceAndSector;
