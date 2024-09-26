import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = {};

  data.forEach(item => {
    const country = item.country === "" ? "Unknown" : item.country;
    const topic = item.topic === "" ? "Unknown" : item.topic;

    if (!result[country]) {
      result[country] = {};
    }
    if (result[country][topic]) {
      result[country][topic] += 1;
    } else {
      result[country][topic] = 1;
    }
  });

  return result;
};

const HorizontalBarChartCountryTopic = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData = aggregateData(data);

      // Filter out 'Unknown' country from aggregatedData
      const countries = Object.keys(aggregatedData).filter(country => country !== "Unknown");
      const topics = [...new Set(data.map(d => d.topic))];

      const stackedData = countries.map(country => {
        const countryData = aggregatedData[country];
        const stack = topics.map(topic => ({
          topic: topic,
          count: countryData[topic] || 0,
          country: country
        }));
        return stack;
      });

      const svg = d3.select(d3Container.current)
        .attr('width', 1300)
        .attr('height', 1000);

      const margin = { top: 20, right: 30, bottom: 50, left: 120 };
      const width = +svg.attr('width') - margin.left - margin.right;
      const height = +svg.attr('height') - margin.top - margin.bottom;

      svg.selectAll('*').remove();

      const y = d3.scaleBand()
        .domain(countries)
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

      const x = d3.scaleLinear()
        .domain([0, d3.max(stackedData, stack => d3.sum(stack, d => d.count))]).nice()
        .range([margin.left, width - margin.right]);

      const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(topics);

      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('padding', '8px')
        .style('background', 'lightgray')
        .style('border', '1px solid black')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0);

      const stack = d3.stack()
        .keys(topics)
        .value((d, key) => d.find(s => s.topic === key).count)(stackedData);

      svg.append('g')
        .selectAll('g')
        .data(stack)
        .enter().append('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d.data[0].country))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth())
        .on('mouseover', function(event, d) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Country: ${d.data[0].country}<br>Topic: ${d.data.find(s => s.count === d[1] - d[0]).topic}<br>Count: ${d[1] - d[0]}`)
            .style('left', Math.min(event.pageX + 10, window.innerWidth - 150) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          tooltip.transition().duration(500).style('opacity', 0);
        });

      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

      return () => tooltip.remove(); // Cleanup on unmount
    }
  }, [data]);

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>Topic Count by Country</h2>
      <svg
        ref={d3Container}
        width={900}
        height={1000}
      />
      <style jsx>{`
        .tooltip {
          font-size: 12px;
          z-index: 9999; /* Ensure tooltip stays on top */
        }
        .x-axis-label, .y-axis-label {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default HorizontalBarChartCountryTopic;
