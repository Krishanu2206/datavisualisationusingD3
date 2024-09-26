import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = data.reduce((acc, item) => {
    const topic = item.topic === "" ? "Unknown" : item.topic;
    if (acc[topic]) {
      acc[topic].total += item.relevance;
      acc[topic].count += 1;
    } else {
      acc[topic] = { total: item.relevance, count: 1 };
    }
    return acc;
  }, {});

  // Calculate average relevance for each topic
  return Object.keys(result).map(topic => ({
    topic: topic,
    relevance: result[topic].total / result[topic].count
  }));
};

const VerticalBarChartRelevanceByTopic = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      let formattedData = aggregateData(data);

      // Sort data in descending order of relevance
      formattedData.sort((a, b) => b.relevance - a.relevance);

      const svg = d3.select(d3Container.current);
      const width = 1200;
      const height = 600;
      const margin = { top: 20, right: 30, bottom: 70, left: 40 };

      // Clear previous contents of the SVG element
      svg.selectAll('*').remove();

      // Define scales
      const x = d3.scaleBand()
        .domain(formattedData.map(d => d.topic))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.relevance)]).nice()
        .range([height - margin.bottom, margin.top]);

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
      svg.selectAll('rect')
        .data(formattedData)
        .enter().append('rect')
        .attr('x', d => x(d.topic))
        .attr('y', d => y(d.relevance))
        .attr('width', x.bandwidth())
        .attr('height', d => height - margin.bottom - y(d.relevance))
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Topic: ${d.topic}<br>Average Relevance: ${d.relevance.toFixed(2)}`)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          tooltip.transition().duration(500).style('opacity', 0);
        });

      // Create x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');

      // Create y-axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', 12);

      // Add x-axis label
      svg.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .text('Topic');

      // Add y-axis label
      svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'end')
        .attr('x', -height / 2)
        .attr('y', margin.left - 60)
        .attr('transform', 'rotate(-90)')
        .text('Average Relevance');
    }
  }, [data]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Vertical Bar Chart - Topic by Relevance</h2>
      <svg
        ref={d3Container}
        width={1500}
        height={600}
      />
      <style jsx>{`
        .tooltip {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default VerticalBarChartRelevanceByTopic;