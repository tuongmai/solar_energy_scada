import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Table, DatePicker, Button, Radio } from 'antd'
import dayjs from 'dayjs'
import useStyleProjectInfo from './style'
import * as moment from 'moment'
import * as d3 from "d3"
import { getProjectSolarEnergy, getProjectSolarPower } from '../../../api'
import Information from './Information'
import './BarChart.css'
import './LineChart.css'

const dateFormat = 'YYYY-MM-DD'
const timeUnit = {
  date: 1,
  month: 2,
  year: 3
}

const BarChart = ({ data, mode }) => {
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

    let step
    if (mode === 'date') {
      step = 100
    }
    else if (mode === 'month') {
      step = 1500
    }
    else if (mode === 'year') {
      step = 50000
    }

    const margin = { top: 20, right: 60, bottom: 40, left: 80 },
          width = (parentWidth) - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom);

    svg.selectAll("*").remove(); // Clear previous content

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left + 15},${margin.top})`);

    // X scale and Axis
    const x = d3.scaleBand()
                .range([0, width])
                .domain(data.map((_, i) => i))
                .padding(0.1);

    g.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x).tickSize(0)) // Hide x-axis tick marks
     .selectAll("text")
     .attr("dy", "1em"); // Adjust the y position of x-axis labels

    // Y scale and Axis
    const maxValue = d3.max(data, d => d.Value);
    const y = d3.scaleLinear()
                .domain([0, Math.ceil(maxValue / 100) * 100])
                .nice()
                .range([height, 0]);

    g.append("g")
      .call(d3.axisLeft(y)
              .ticks(5)
              .tickValues(d3.range(0, Math.ceil(maxValue / 100) * 100 + 1, step))
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
      .text("Energy (kWh)");

    // Tooltip
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Bars
    const bars = g.selectAll(".bar")
                  .data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (_, i) => x(i) + x.bandwidth() / 4)
        .attr("width", x.bandwidth() / 4)
        .attr("y", d => y(d.Value))
        .attr("height", d => height - y(d.Value))
        .on("mouseover", function(event, d) {
          tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
          tooltip.html(`Energy: ${d.Value}`)
                 .style("left", (event.pageX + 5) + "px")
                 .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });

    // bars.attr("x", (_, i) => x(i))
    //     .attr("width", x.bandwidth() / 2)
    //     .attr("y", d => y(d.Value))
    //     .attr("height", d => height - y(d.Value));

    bars.exit().remove();

  }, [data, mode, parentWidth]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};

const LineChart = ({ data }) => {
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

    const margin = { top: 20, right: 60, bottom: 40, left: 80 },
          width = (parentWidth) - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom);

    svg.selectAll("*").remove(); // Clear previous content

    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the date strings and filter out invalid data
    const parseDate = d3.timeParse("/Date(%Q)/");
    const filteredData = data
      .map(d => ({ ...d, parsedDate: parseDate(d.DateTime) }))
      .filter(d => d.Value !== null && d.Value >= 0);

    const x = d3.scaleLinear()
                .range([0, width])
                .domain([0, 23]);

    g.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x)
             .ticks(24)
             .tickFormat(d => d % 1 === 0 ? d : "")
             .tickSize(0)) // Hide x-axis tick marks
     .selectAll("text")
     .attr("dy", "1em"); // Adjust the y position of x-axis labels

    // Y scale and Axis
    const maxValue = d3.max(filteredData, d => d.Value);
    const y = d3.scaleLinear()
                .domain([0, Math.ceil(maxValue / 100) * 100])
                .nice()
                .range([height, 0]);

    g.append("g")
     .call(d3.axisLeft(y)
             .ticks(5)
             .tickValues(d3.range(0, Math.ceil(maxValue / 100) * 100 + 1, 100))
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
     .text("Power (kW)");

    // Tooltip
    const tooltip = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Line generator with missing data handling
    const line = d3.line()
                   .defined(d => d.Value !== null && d.Value >= 0)
                   .x(d => x(d.parsedDate.getHours() + d.parsedDate.getMinutes() / 60))
                   .y(d => y(d.Value));

    // Draw line
    g.append("path")
     .datum(filteredData)
     .attr("class", "line")
     .attr("d", line);

    // Points
    g.selectAll(".dot")
     .data(filteredData)
     .enter().append("circle")
     .attr("class", "dot")
     .attr("cx", d => x(d.parsedDate.getHours() + d.parsedDate.getMinutes() / 60))
     .attr("cy", d => y(d.Value))
     .attr("r", 5)
     .on("mouseover", function(event, d) {
       tooltip.transition()
              .duration(200)
              .style("opacity", .9);
       tooltip.html(`${d.parsedDate.getHours() < 10 ? '0' + d.parsedDate.getHours() : d.parsedDate.getHours()}:${d.parsedDate.getMinutes() < 10 ? '0' + d.parsedDate.getMinutes() : d.parsedDate.getMinutes()}<br>Value: ${d.Value}`)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
     })
     .on("mouseout", function() {
       tooltip.transition()
              .duration(500)
              .style("opacity", 0);
     });

  }, [data, parentWidth]);

  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
};

const ProjectInfo = () => {
  const [energyData, setEnergyData] = useState([])
  const [powerData, setPowerData] = useState([])
  const [dateStart, setDateStart] = useState(moment().format(dateFormat))
  const [dateEnd, setDateEnd] = useState(moment().add(1, 'days').format(dateFormat))
  const [powerDate, setPowerDate] = useState(moment().format(dateFormat))
  const [pickerMode, setPickerMode] = useState('date')
  const [isFetchEnergy, setIsFetchEnergy] = useState(true)
  const [isFetchPower, setIsFetchPower] = useState(true)
  const view = useSelector(state => state.view.view)

  const classes = useStyleProjectInfo()

  const onChangeDate = (d, dateString) => {
    const date = moment(dateString)
    setDateStart(date.format(dateFormat))
    setDateEnd(date.add(1, 'days').format(dateFormat))
    setIsFetchEnergy(true)
  }

  const onChangeMonth = (d, dateString) => {
    const date = moment(dateString)
    setDateStart(date.startOf('month').format(dateFormat))
    setDateEnd(date.endOf('month').format(dateFormat))
    setIsFetchEnergy(true)
  }

  const onChangeYear = (d, dateString) => {
    const date = moment(dateString)
    setDateStart(date.startOf('year').format(dateFormat))
    setDateEnd(date.endOf('year').format(dateFormat))
    setIsFetchEnergy(true)
  }

  const onChangePowerDate = (d, dateString) => {
    const date = moment(dateString)
    setPowerDate(date.format(dateFormat))
    setIsFetchPower(true)
  }

  useEffect(() => {
    if (isFetchEnergy) {
      getProjectSolarEnergy(timeUnit[pickerMode], dateStart, dateEnd)
        .then(res => {
          console.log('res: ', res)
          let tmp = res.data
          if (pickerMode === 'date') {
            tmp.map(data => {
              if (data.Value > 1000)
                data.Value = 0
            })
            while(tmp.length < 24)
              tmp.push({ Value: 0 })
          }
          if (pickerMode === 'month') {
            let daysInMonth = new Date(2024, moment(dateStart).month(), 0).getDate()
            while(tmp.length < daysInMonth)
              tmp.push({ Value: 0 })
          }
          if (pickerMode === 'year') {
            while(tmp.length < 12)
              tmp.push({ Value: 0 })
          }
          
          setEnergyData(tmp)
        })
      setIsFetchEnergy(false)
    }    
  }, [isFetchEnergy])

  useEffect(() => {
    async function getPowerData() {
      if (isFetchPower) {
        const res = await getProjectSolarPower(powerDate)
        console.log('power: ', res)
        let tmp = res.data
        let tmpTime = parseInt(tmp[tmp.length - 1]?.DateTime?.split('(')[1].split(')')[0])
        let i = 1
        while(tmp.length < 24 * 60) {
          let dateTime = `/Date(${tmpTime + i * 60000})/`
          tmp.push({ DateTime: dateTime, Value: null })
        }
        setPowerData(tmp)
        // setIsFetchPower(false)
      }
    }

    getPowerData()
    const interval = setInterval(getPowerData, 60000);
    return () => {
      clearInterval(interval)
      setIsFetchPower(false)
    }
  }, [isFetchPower])

  return (
    <div className={classes.content}>
      {/* <Information/> */}
      <div className={classes.chartContainer}>
        <div className={classes.chart}>
          <div className={classes.chartHeader}>
            <DatePicker defaultValue={dayjs(moment().format(dateFormat), dateFormat)} onChange={onChangeDate} picker='date' style={{ display: pickerMode === 'date' ? 'block' : 'none', width: '150px' }} />
            <DatePicker defaultValue={dayjs(moment().format(dateFormat), dateFormat)} onChange={onChangeMonth} picker='month' style={{ display: pickerMode === 'month' ? 'block' : 'none', width: '150px' }} />
            <DatePicker defaultValue={dayjs(moment().format(dateFormat), dateFormat)} onChange={onChangeYear} picker='year' style={{ display: pickerMode === 'year' ? 'block' : 'none', width: '150px' }} />
            <Radio.Group value={pickerMode} onChange={(e) => setPickerMode(e.target.value)}>
              <Radio.Button key='date' value="date" onClick={onChangeDate}>Day</Radio.Button>
              <Radio.Button key='month' value="month" onClick={onChangeMonth}>Month</Radio.Button>
              <Radio.Button key='year' value="year" onClick={onChangeYear}>Year</Radio.Button>
            </Radio.Group>
          </div>
          <div className={classes.chartContent}>
            <h3>Energy</h3>
            <BarChart data={energyData} mode={pickerMode}/>
          </div>
        </div>
        <div className={classes.chart}>
          <div className={classes.chartHeader}>
            <DatePicker defaultValue={dayjs(moment().format(dateFormat), dateFormat)} onChange={onChangePowerDate} picker='date' />
          </div>
          <div className={classes.chartContent}>
            <h3>Power</h3>
            <LineChart data={powerData}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectInfo