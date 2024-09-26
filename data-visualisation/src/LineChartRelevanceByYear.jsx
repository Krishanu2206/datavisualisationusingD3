import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = data.reduce((acc, item) => {
    const year = item.end_year === "" ? "Unknown" : item.end_year;
    if (acc[year]) {
      acc[year].total += item.relevance;
      acc[year].count += 1;
    } else {
      acc[year] = { total: item.relevance, count: 1 };
    }
    return acc;
  }, {});

  // Calculate average relevance for each year
  return Object.keys(result)
    .filter(year => year !== "Unknown")
    .map(year => ({
      year: year,
      relevance: result[year].total / result[year].count
    }));
};

const LineChartRelevanceByYear = ({ data }) => {
  const d3Container = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      let formattedData = aggregateData(data);

      const svg = d3.select(d3Container.current);
      const width = 700;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 50, left: 60 };

      // Clear previous contents of the SVG element
      svg.selectAll('*').remove();

      // Define scales
      const x = d3.scaleBand()
        .domain(formattedData.map(d => d.year))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.relevance)]).nice()
        .range([height - margin.bottom, margin.top]);

      // Create line function
      const line = d3
        .line()
        .x(d => x(d.year) + x.bandwidth() / 2) // Center the point in the band
        .y(d => y(d.relevance));

      // Create the line path
      svg.append('path')
        .datum(formattedData)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)
        .attr('d', line);

      // Create circles for data points
      svg.selectAll('.dot')
        .data(formattedData)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.year) + x.bandwidth() / 2)
        .attr('cy', d => y(d.relevance))
        .attr('r', 4)
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
          d3.select(tooltipRef.current)
            .style('opacity', 0.9)
            .html(`Year: ${d.year}<br>Average Relevance: ${d.relevance.toFixed(2)}`)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          d3.select(tooltipRef.current).style('opacity', 0);
        });

      // Create x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', 12)
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

      // Create y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', 12);

      // Add axis labels
      svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', (width - margin.right) / 2)
        .attr('y', height - margin.bottom + 40)
        .text('End Year');

      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', -margin.top - 120)
        .attr('y', margin.left - 50)
        .attr('transform', 'rotate(-90)')
        .text('Average Relevance');
    }
  }, [data]);

  return (
    <>
    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Horizontal Bar Chart - Average Relevance by End Year</h2>
      <svg ref={d3Container} width={800} height={400} />
      <div ref={tooltipRef} className="tooltip" style={{ position: 'absolute', padding: '8px', background: 'lightgray', border: '1px solid black', borderRadius: '4px', pointerEvents: 'none', opacity: 0 }}></div>
    </>
  );
};

export default LineChartRelevanceByYear;
