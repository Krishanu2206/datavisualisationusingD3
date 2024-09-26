import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const aggregateDataForTree = (data) => {
  // Group data by pestle
  const pestleGroup = d3.group(data, d => d.pestle);

  // Sort each pestle's sectors in descending order by count and group the rest under "Others"
  const nestedData = Array.from(pestleGroup, ([pestle, values]) => {
    const sectorGroup = d3.groups(values, d => d.sector)
      .map(([sector, items]) => ({ sector, count: items.length }));

    sectorGroup.sort((a, b) => b.count - a.count);

    const topSectors = sectorGroup.slice(0, 5);
    const otherSectors = sectorGroup.slice(5);

    if (otherSectors.length > 0) {
      topSectors.push({
        sector: "Others",
        count: d3.sum(otherSectors, d => d.count)
      });
    }

    return {
      name: pestle,
      count: values.length, // Total count of items in this pestle
      children: topSectors.map(sector => ({ name: sector.sector, count: sector.count }))
    };
  });

  // Sort pestles alphabetically
  nestedData.sort((a, b) => d3.ascending(a.name, b.name));
  const topPestles = nestedData.slice(0, 10);

  // Sum up counts of the rest to create an "Others" node
  const othersCount = nestedData.slice(10).reduce((acc, curr) => acc + curr.count, 0);
  topPestles.push({ name: "Others", count: othersCount, children: [{ name: "Other Sectors", count: 0 }] });

  return { name: "Pestles", children: topPestles };
};

const TreeDiagram = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data.length > 0) {
      // Filter out data with empty pestle, sector, or topic
      const filteredData = data.filter(d => d.pestle && d.sector && d.topic);

      const formattedData = aggregateDataForTree(filteredData);

      const width = 900;
      const height = 1000;

      const svg = d3.select(d3Container.current)
        .attr("width", width)
        .attr("height", height)
        .style("font", "12px sans-serif")
        .style("user-select", "none")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

      // Clear previous contents of the SVG element
      svg.selectAll('*').remove();

      const root = d3.hierarchy(formattedData);
      const treeLayout = d3.tree().size([height - 250, width - 220]);

      treeLayout(root);

      const g = svg.append("g")
        .attr("transform", `translate(${-width / 2 + 80},${-height / 2 + 40})`);

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
        .text(d => d.data.name === "Pestles" ? "Pestles" : d.data.name) // Display "Pestles" for the root node
        .clone(true).lower()
        .attr("stroke", "white");

      // Tooltip for displaying count on hover
      node.append("title")
        .text(d => `${d.data.name}: ${d.data.count}`);
    }
  }, [data]);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>Tree Diagram - Top Pestles and Top Sectors</h2>
      <svg
        ref={d3Container}
        width={960}
        height={1000}
      />
    </div>
  );
};

export default TreeDiagram;
