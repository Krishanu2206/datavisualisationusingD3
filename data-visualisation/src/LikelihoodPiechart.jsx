import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const sectorsOfInterest = [
    "Manufacturing", "Financial services", "Energy", "Retail",
    "Information Technology", "Support services", "Government", "Aerospace & defence"
  ];

  return data.reduce((acc, item) => {
    const sector = sectorsOfInterest.includes(item.sector) ? item.sector : "Others";
    if (acc[sector]) {
      acc[sector].total += item.likelihood; // Assuming 'likelihood' is a numeric value
      acc[sector].count++;
    } else {
      acc[sector] = { total: item.likelihood, count: 1 };
    }
    return acc;
  }, {});
};

const LikelihoodPieChart = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData = aggregateData(data);

      const sectors = Object.keys(aggregatedData);

      // Calculate average likelihood for each sector
      const likelihoods = Object.values(aggregatedData).map(sectorData => sectorData.total / (sectorData.count || 1)); // Handle potential missing 'count' property

      const svg = d3.select(svgRef.current);
      const svgWidth = 400;
      const svgHeight = 400;
      const radius = Math.min(svgWidth, svgHeight) / 2;

      const g = svg.append('g')
        .attr('transform', `translate(${svgWidth / 2},${svgHeight / 2})`);

      const pie = d3.pie()
        .value(d => d)
        (likelihoods);

      const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

      const color = d3.scaleOrdinal()
        .domain(sectors)
        .range(d3.schemeCategory10);

      g.selectAll('path')
        .data(pie)
        .enter().append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(sectors[i]))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .on('mouseover', function(event, d) {
          const sector = sectors[d.index];
          const likelihood = likelihoods[d.index];
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
          // Added line to display average likelihood in tooltip
          g.append('text')
            .attr('class', 'tooltip2')
            .attr('transform', `translate(${arc.centroid(d)} - 10)`)
            .attr('dy', '0.5em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(`Avg. Likelihood: ${likelihood.toFixed(2)}`);
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
    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Sector and Likelihood Piechart</h2>
    <svg ref={svgRef} width={400} height={400} />
    </>
  );
};

export default LikelihoodPieChart;
