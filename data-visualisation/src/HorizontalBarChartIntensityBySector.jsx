import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = data.reduce((acc, item) => {
    const sector = item.sector === "" ? "Unknown" : item.sector;
    if (acc[sector]) {
      acc[sector].total += item.relevance;
      acc[sector].count += 1;
    } else {
      acc[sector] = { total: item.relevance, count: 1 };
    }
    return acc;
  }, {});

  // Calculate average intensity for each sector
  return Object.keys(result)
    .filter(sector => sector !== "Unknown")
    .map(sector => ({
      sector: sector,
      intensity: result[sector].total / result[sector].count
    }));
};

const HorizontalBarChartIntensityBySector = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      let formattedData = aggregateData(data);

      // Sort data in descending order of intensity
      formattedData.sort((a, b) => b.intensity - a.intensity);

      const svg = d3.select(d3Container.current);
      const width = 700;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 140 };

      // Clear previous contents of the SVG element
      svg.selectAll('*').remove();

      // Define scales
      const y = d3.scaleBand()
        .domain(formattedData.map(d => d.sector))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

      const x = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.intensity)]).nice()
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
        .attr('y', d => y(d.sector))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.intensity) - margin.left)
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Sector: ${d.sector}<br>Average Intensity: ${d.intensity.toFixed(2)}`)
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
        .text('Average Intensity');

      // Add y-axis label
      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', -margin.top - 120)
        .attr('y', margin.left - 130)
        .attr('transform', 'rotate(-90)')
        .text('Sector');

      return () => tooltip.remove(); // Cleanup on unmount
    }
  }, [data]);

  return (
    <>
    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Horizontal Bar Chart - Sector by Average Intensity</h2>
      <svg
        ref={d3Container}
        width={800}
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

export default HorizontalBarChartIntensityBySector;
