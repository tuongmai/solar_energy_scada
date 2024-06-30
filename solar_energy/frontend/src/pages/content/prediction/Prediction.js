import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { DatePicker } from 'antd'
import LineChart from './LineChart'
import useStylePrediction from './style'
import dayjs from 'dayjs'
import * as moment from 'moment'
import { getPredictPower } from '../../../api'

const dateFormat = 'YYYY-MM-DD'

const { RangePicker } = DatePicker

const Prediction = () => {
  const view = useSelector(state => state.view.view)
  const [data, setData] = useState([])
  const [startDate, setStartDate] = useState(moment().format(dateFormat))
  const [endDate, setEndDate] = useState(moment().add(7, 'days').format(dateFormat))

  const classes = useStylePrediction()

  const onRangeChange = (dates, dateStrings) => {
    setStartDate(moment(dateStrings[0]).format(dateFormat))
    setEndDate(moment(dateStrings[1]).format(dateFormat))
  }

  useEffect(() => {
    getPredictPower(startDate, endDate)
      .then(async (res) => {
        let dataTmp = []
        await Promise.all(res.map(i => {
          dataTmp.push({
            ...i,
            DateTime: i.date,
            Value: i.power
          })
        }))
        setData(dataTmp)
      })
  }, [startDate, endDate])

  return (
    <div className={classes.content}>
      <div className={classes.chart}>
        <div className={classes.chartHeader}>
          <RangePicker
            defaultValue={[dayjs(moment().format(dateFormat), dateFormat), dayjs(moment().add(7, 'days').format(dateFormat), dateFormat)]}
            format={dateFormat}
            onChange={onRangeChange}
            minDate={dayjs(moment().format(dateFormat), dateFormat)}
            maxDate={dayjs(moment().add(15, 'days').format(dateFormat), dateFormat)}
            style={{ width: 'fit-content' }}
          />
        </div>
        <div className={classes.chartContent}>
          <h3>Power Prediction</h3>
          <LineChart data={data} measure={'Power (kW) / Irradiance (W/m2)'} graphStep={100} />
        </div>
        <div className={classes.note}>
          <div className={classes.noteItem}>
            <div style={{ backgroundColor: 'green' }}></div>
            <span>Power</span>
          </div>
          <div className={classes.noteItem}>
            <div style={{ backgroundColor: 'rgb(227, 212, 3)' }}></div>
            <span>Irradiance</span>
          </div>
          <div className={classes.noteItem}>
            <div style={{ backgroundColor: 'rgb(203, 3, 3)' }}></div>
            <span>Temperature</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Prediction