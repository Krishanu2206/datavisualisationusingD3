import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = {};

  data.forEach(item => {
    const year = item.end_year === "" ? "Unknown" : item.end_year;
    if (!result[year]) {
      result[year] = {};
    }
    if (result[year][item.topic]) {
      result[year][item.topic] += 1;
    } else {
      result[year][item.topic] = 1;
    }
  });

  return result;
};

const HorizontalBarChartEndYearTopic = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData = aggregateData(data);

      const years = Object.keys(aggregatedData).filter(year => year!="Unknown");
      const topics = [...new Set(data.map(d => d.topic))];

      const stackedData = years.map(year => {
        const yearData = aggregatedData[year];
        const stack = topics.map(topic => ({
          topic: topic,
          count: yearData[topic] || 0,
          year: year
        }));
        return stack;
      });

      const svg = d3.select(d3Container.current);
      const width = 1000;
      const height = 800;
      const margin = { top: 20, right: 30, bottom: 20, left: 30 };

      svg.selectAll('*').remove();

      const y = d3.scaleBand()
        .domain(years)
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
        .attr('y', d => y(d.data[0].year))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d[1]) - x(d[0]))
        .on('mouseover', function(event, d) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`EndYear: ${d.data[0].year}<br>Topic: ${d.data.find(s => s.count === d[1] - d[0]).topic}<br>Count: ${d[1] - d[0]}`)
            .style('left', (event.pageX + 5) + 'px')
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

      return () => {
        tooltip.remove(); // Cleanup tooltip on component unmount
      };
    }
  }, [data]);

  return (
    <div>
    <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Topic By End year</h2>
      <svg
        ref={d3Container}
        width={1000}
        height={800}
      />
      <style jsx>{`
        .tooltip {
          font-size: 12px;
        }
        .chart-title {
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default HorizontalBarChartEndYearTopic;
