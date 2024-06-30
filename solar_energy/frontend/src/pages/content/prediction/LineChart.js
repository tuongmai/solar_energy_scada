import React, { useState, useEffect, useRef } from 'react'
import * as d3 from "d3"
import * as moment from 'moment';
import './LineChart.css'

const LineChart = ({ data, measure, graphStep }) => {
    const svgRef = useRef();
    const [parentWidth, setParentWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => {
        const parentNode = svgRef.current.parentNode;
        setParentWidth(parentNode.clientWidth);
      };

      handleResize(); // Set initial width
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      if (parentWidth === 0) return; // Wait until parent width is set

      const margin = { top: 20, right: 60, bottom: 50, left: 80 },
            width = (parentWidth) - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

      const svg = d3.select(svgRef.current)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

      svg.selectAll("*").remove(); // Clear previous content

      const g = svg.append("g")
                   .attr("transform", `translate(${margin.left},${margin.top})`);

      // Parse the date strings and filter out invalid data
      const parseDate = d3.timeParse("%Q");
      const filteredData = data
        .map(d => ({ ...d, parsedDate: parseDate(d.DateTime) }))
        .filter(d => d.Value !== null && d.Value >= 0);

      const minDate = d3.min(filteredData, d => d.parsedDate);
      const maxDate = d3.max(filteredData, d => d.parsedDate);
      const x = d3.scaleTime()
                  .range([0, width])
                  .domain([minDate, maxDate]);

      const xAxis = g.append("g")
                      .attr("transform", `translate(0,${height})`)
                      .call(d3.axisBottom(x)
                              .tickFormat(d => moment(d).format('Do HH:mm'))
                              .tickSize(2));

      xAxis.selectAll("text")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start")
            .attr("dy", ".35em")
            .attr("dx", ".35em");

      // Y scale and Axis
      const maxValue = d3.max(filteredData, d => d.Value);
      const y = d3.scaleLinear()
                  .domain([0, Math.ceil(maxValue /graphStep) * graphStep])
                  .nice()
                  .range([height, 0]);

      g.append("g")
       .call(d3.axisLeft(y)
               .ticks(5)
               .tickValues(d3.range(0, Math.ceil(maxValue /graphStep) * graphStep + 1, graphStep))
               .tickSize(-width)
               .tickFormat(d => d)
             )
       .call(g => g.select(".domain").remove()) // Remove y-axis line
       .call(g => g.selectAll(".tick line")
                   .attr("stroke", "#ccc") // Style grid lines
       );

      // Y-axis label
      g.append("text")
       .attr("class", "y-axis-label")
       .attr("text-anchor", "middle")
       .attr("transform", `translate(${-margin.left + 15},${height / 2})rotate(-90)`)
       .text(measure);

      const maxValue2 = d3.max(filteredData, d => d.temperature);
      const y2 = d3.scaleLinear()
                  .domain([0, Math.ceil(maxValue2 / 5) * 5 + 10])
                  .nice()
                  .range([height, 0]);

      g.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(y2)
                .ticks(5)
                .tickValues(d3.range(0, Math.ceil(maxValue / graphStep) * 10 + 1, 10))
                .tickSize(0)
              )
        .call(g => g.select(".domain").remove()); // Remove y-axis line

      // Y-axis label for the second line
      g.append("text")
        .attr("class", "y-axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width + margin.right - 15},${height / 2})rotate(-90)`)
        .text("Temperature (°C)"); // Change this text to your desired y-axis label

      // Tooltip
      const tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0);

      // Line generator with missing data handling
      const energyLine = d3.line()
                     .defined(d => d.Value !== null && d.Value >= 0)
                     .x(d => x(d.parsedDate))
                     .y(d => y(d.Value));

      const dniLine = d3.line()
                     .defined(d => d.dni !== null && d.dni >= 0)
                     .x(d => x(d.parsedDate))
                     .y(d => y(d.dni));

      const temperatureLine = d3.line()
                     .defined(d => d.temperature !== null && d.temperature >= 0)
                     .x(d => x(d.parsedDate))
                     .y(d => y2(d.temperature));

      const energyLinePath = g.append("svg")
                      .attr("width", width)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("path")
                      .datum(filteredData)
                      .attr("class", "line line1")
                      .attr("d", energyLine);

      const dniLinePath = g.append("svg")
                      .attr("width", width)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("path")
                      .datum(filteredData)
                      .attr("class", "line line2")
                      .attr("d", dniLine);

      const temperatureLinePath = g.append("svg")
                      .attr("width", width)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("path")
                      .datum(filteredData)
                      .attr("class", "line line3")
                      .attr("d", temperatureLine);
      // Points
      const energyDots = g.selectAll(".dot1")
                    .data(filteredData)
                    .enter()
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("circle")
                    .attr("class", "dot dot1")
                    .attr("cx", d => x(d.parsedDate))
                    .attr("cy", d => y(d.Value))
                    .attr("r", 2)
                    .on("mouseover", function(event, d) {
                      tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                      tooltip.html(`${moment(d.parsedDate).format('MMM Do HH:mm')}<br>Energy: ${d.Value}`)
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function() {
                      tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

      const dniDots = g.selectAll(".dot2")
                    .data(filteredData)
                    .enter()
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("circle")
                    .attr("class", "dot dot2")
                    .attr("cx", d => x(d.parsedDate))
                    .attr("cy", d => y(d.dni))
                    .attr("r", 2)
                    .on("mouseover", function(event, d) {
                      tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                      tooltip.html(`${moment(d.parsedDate).format('MMM Do HH:mm')}<br>Irradiance: ${d.dni}`)
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function() {
                      tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

      const temperatureDots = g.selectAll(".dot3")
                    .data(filteredData)
                    .enter()
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("circle")
                    .attr("class", "dot dot3")
                    .attr("cx", d => x(d.parsedDate))
                    .attr("cy", d => y2(d.temperature))
                    .attr("r", d => d.temperature ? 2 : 0)
                    .on("mouseover", function(event, d) {
                      tooltip.transition()
                            .duration(200)
                            .style("opacity", .9);
                      tooltip.html(`${moment(d.parsedDate).format('MMM Do HH:mm')}<br>Temperature: ${d.temperature}`)
                            .style("left", (event.pageX + 5) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function() {
                      tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

      // Zoom function
      const zoom = d3.zoom()
                    .scaleExtent([1, 10])
                    .translateExtent([[0, 0], [width, height]])
                    .extent([[0, 0], [width, height]])
                    .on("zoom", (event) => {
                      const newX = event.transform.rescaleX(x);
                      xAxis.call(d3.axisBottom(newX)
                                    .tickFormat(d => moment(d).format('Do HH:mm'))
                                    .tickSize(2));
                      xAxis.selectAll("text")
                                    .attr("transform", "rotate(45)")
                                    .style("text-anchor", "start")
                                    .attr("dy", ".35em")
                                    .attr("dx", ".35em");
                      dniLinePath.attr("d", dniLine.x(d => newX(d.parsedDate)));
                      temperatureLinePath.attr("d", temperatureLine.x(d => newX(d.parsedDate)));
                      energyLinePath.attr("d", energyLine.x(d => newX(d.parsedDate)));
                      dniDots.attr("cx", d => newX(d.parsedDate));
                      temperatureDots.attr("cx", d => newX(d.parsedDate));
                      energyDots.attr("cx", d => newX(d.parsedDate));
                    });

      svg.call(zoom);

    }, [data, parentWidth]);

    return (
      <>
        <svg ref={svgRef}></svg>
      </>
    );
};

export default LineChart