import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateData = (data) => {
  const result = {};

  data.forEach(item => {
    const region = item.region === "" ? "Unknown" : item.region;
    if (!result[region]) {
      result[region] = {};
    }
    if (result[region][item.topic]) {
      result[region][item.topic] += 1;
    } else {
      result[region][item.topic] = 1;
    }
  });

  return result;
};

const HorizontalBarChartRegionTopic = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      const aggregatedData = aggregateData(data);

      const regions = Object.keys(aggregatedData).filter(region=> region!="Unknown" && region!="world");

      const topics = [...new Set(data.map(d => d.topic))];

      const stackedData = regions.map(region => {
        const regionData = aggregatedData[region];
        const stack = topics.map(topic => ({
          topic: topic,
          count: regionData[topic] || 0,
          region: region
        }));
        return stack;
      });

      const svg = d3.select(d3Container.current);
      const width = 1000;
      const height = 800;
      const margin = { top: 20, right: 30, bottom: 20, left: 100 };

      svg.selectAll('*').remove();

      const y = d3.scaleBand()
        .domain(regions)
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
        .attr('y', d => y(d.data[0].region))
        .attr('x', d => x(d[0]))
        .attr('width', d => x(d[1]) - x(d[0]))
        .attr('height', y.bandwidth())
        .on('mouseover', function(event, d) {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Region: ${d.data[0].region}<br>Topic: ${d.data.find(s => s.count === d[1] - d[0]).topic}<br>Count: ${d[1] - d[0]}`)
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

      return () => tooltip.remove(); // Cleanup on unmount
    }
  }, [data]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Horizontal Bar Chart - Region by Topic</h2>
      <svg
        ref={d3Container}
        width={1000}
        height={800}
      />
      <style jsx>{`
        .tooltip {
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default HorizontalBarChartRegionTopic;
