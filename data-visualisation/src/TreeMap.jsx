import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateDataForTree = (data) => {
  // Group data by sector
  const sectorGroup = d3.group(data, d => d.sector);

  // Sort each sector's topics in descending order by relevance and group the rest under "Others"
  const nestedData = Array.from(sectorGroup, ([sector, values]) => {
    const topicGroup = d3.groups(values, d => d.topic)
      .map(([topic, items]) => ({ topic, relevance: d3.sum(items, d => d.relevance) }));

    topicGroup.sort((a, b) => b.relevance - a.relevance);

    const topTopics = topicGroup.slice(0, 5);
    const otherTopics = topicGroup.slice(5);

    if (otherTopics.length > 0) {
      topTopics.push({
        topic: "Others",
        relevance: d3.sum(otherTopics, d => d.relevance)
      });
    }

    return {
      name: sector,
      count: values.length, // Total count of items in this sector
      children: topTopics.map(topic => ({ name: topic.topic, count: topic.relevance }))
    };
  });

  // Sort sectors by count in descending order and take the top 10
  nestedData.sort((a, b) => b.count - a.count);
  const topSectors = nestedData.slice(0, 10);

  // Sum up counts of the rest to create an "Others" node
  const othersCount = nestedData.slice(10).reduce((acc, curr) => acc + curr.count, 0);
  topSectors.push({ name: "Others", count: othersCount });

  return { name: "sectors", children: topSectors };
};

const TreeDiagram = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      // Filter out data with empty sector
      const filteredData = data.filter(d => d.sector !== "");

      const formattedData = aggregateDataForTree(filteredData);

      const width = 960;
      const height = 1000;

      const svg = d3.select(d3Container.current)
        .attr("width", width)
        .attr("height", height)
        .style("font", "12px sans-serif")
        .style("user-select", "none")
        .attr("viewBox", [-width / 2, -height / 2, width, height]); // Adjust viewBox

      // Clear previous contents of the SVG element
      svg.selectAll('*').remove();

      const root = d3.hierarchy(formattedData);
      const treeLayout = d3.tree().size([height - 250, width - 200]);

      treeLayout(root);

      const g = svg.append("g")
        .attr("transform", `translate(${-width / 2 + 80},${-height / 2 + 40})`); // Adjust transform

      const link = g.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x));

      const node = g.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);

      node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

      node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke", "white");

      // Tooltip for displaying count on hover
      node.append("title")
        .text(d => `${d.data.name}: ${d.data.count}`);
    }
  }, [data]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Tree Diagram - Top Sectors and Top Topics under each Sector</h2>
      <svg
        ref={d3Container}
        width={960}
        height={1000}
      />
    </div>
  );
};

export default TreeDiagram;
