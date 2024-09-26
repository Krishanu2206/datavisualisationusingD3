import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = data.reduce((acc, item) => {
    const region = item.region === "" ? "Unknown" : item.region;
    if (acc[region]) {
      acc[region].total += item.likelihood;
      acc[region].count += 1;
    } else {
      acc[region] = { total: item.likelihood, count: 1 };
    }
    return acc;
  }, {});

  // Calculate average likelihood for each region
  return Object.keys(result).map(region => ({
    region: region,
    likelihood: result[region].total / result[region].count
  }));
};

const HorizontalBarChartLikelihoodByRegion = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      let formattedData = aggregateData(data);

      // Filter out "Unknown" region
      formattedData = formattedData.filter(d => d.region !== "Unknown");

      // Sort data in descending order of likelihood
      formattedData.sort((a, b) => b.likelihood - a.likelihood);

      const svg = d3.select(d3Container.current);
      const width = 700;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 120 };

      // Clear previous contents of the SVG element
      svg.selectAll('*').remove();

      // Define scales
      const y = d3.scaleBand()
        .domain(formattedData.map(d => d.region))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

      const x = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.likelihood)]).nice()
        .range([margin.left, width - margin.right]);

      // Create a tooltip
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('padding', '8px')
        .style('background', 'lightgray')
        .style('border', '1px solid black')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0);

      // Create bars
      svg.append('g')
        .selectAll('rect')
        .data(formattedData)
        .enter().append('rect')
        .attr('x', margin.left)
        .attr('y', d => y(d.region))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.likelihood) - margin.left)
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Region: ${d.region}<br>Likelihood: ${d.likelihood.toFixed(2)}`)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          tooltip.transition().duration(500).style('opacity', 0);
        });

      // Create y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', 12);

      // Create x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      // Add x-axis label
      svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', (width - margin.right)/2)
        .attr('y', height - margin.bottom + 40)
        .text('Average Likelihood');

      // Add y-axis label
      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', -margin.top -140)
        .attr('y', margin.left - 100)
        .attr('transform', 'rotate(-90)')
        .text('Region');
    }
  }, [data]);

  return (
    <>
    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Horizontal Bar Chart - Region by Average Likelihood</h2>
      <svg
        ref={d3Container}
        width={700}
        height={400}
      />
      <style jsx>{`
        .tooltip {
          font-size: 12px;
        }
        .x-axis-label, .y-axis-label {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default HorizontalBarChartLikelihoodByRegion;
