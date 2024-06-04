import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import * as moment from 'moment'
import { getWeatherForecast } from '../../../api'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import useStyleWeather from './style'
import LineChart from './LineChart'

const dateFormat = 'YYYY-MM-DD'

const Weather = () => {
  const view = useSelector(state => state.view.view)
  const [data, setData] = useState([])
  const [dniData, setDniData] = useState([])
  const [temperatureData, setTemperatureData] = useState([])
  const [irradianceDate, setIrradianceDate] = useState(moment().format(dateFormat))
  const [temperatureDate, setTemperatureDate] = useState(moment().format(dateFormat))
  const [currentIrradiance, setCurrentIrradiance] = useState(0)
  const [currentTemperature, setCurrentTemperature] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)

  const classes = useStyleWeather()

  const onChangeIrradianceDate = (d, dateString) => {
    const date = moment(dateString)
    setIrradianceDate(date.format(dateFormat))
  }

  const onChangeTemperatureDate = (d, dateString) => {
    const date = moment(dateString)
    setTemperatureDate(date.format(dateFormat))
  }

  useEffect(() => {
    getWeatherForecast(irradianceDate, temperatureDate)
      .then(async (res) => {
        let dniData = []
        let tempeData = []
        let currentTime = moment().valueOf()
        let count = -1
        await Promise.all(res.map(i => {
          dniData.push({ DateTime: i.date, Value: i.date <= currentTime ? i.dni : null })
          tempeData.push({ DateTime: i.date, Value: i.date <= currentTime ? i.temperature : null })
          if (i.date <= currentTime) count++
        }))
        setCurrentIndex(count)
        setCurrentIrradiance(res[count].dni)
        setCurrentTemperature(res[count].temperature)
        setDniData(dniData)
        setTemperatureData(tempeData)
        setData(res)
      })
  }, [])

  useEffect(() => {
    getWeatherForecast(irradianceDate, irradianceDate)
      .then(async (res) => {
        let dniData = []
        let currentTime = moment().valueOf()
        await Promise.all(res.map(i => {
          dniData.push({ DateTime: i.date, Value: i.date <= currentTime ? i.dni : null })
        }))
        setDniData(dniData)
      })
  }, [irradianceDate])

  useEffect(() => {
    getWeatherForecast(temperatureDate, temperatureDate)
      .then(async (res) => {
        let tempeData = []
        let currentTime = moment().valueOf()
        await Promise.all(res.map(i => {
          tempeData.push({ DateTime: i.date, Value: i.date <= currentTime ? i.temperature : null })
        }))
        setTemperatureData(tempeData)
      })
  }, [temperatureDate])

  return (
    <div className={classes.content}>
      {/* <h3>Current Information</h3> */}
      <div className={classes.cardContainer}>
        <div className={classes.card}>
          <div>
            <h2 style={{color: 'blue', fontWeight: '700'}}>{currentIrradiance} W/m2</h2>
            <p>Irradiation</p>
          </div>
          <img src='/static/image/irradiance_icon.png' style={{ height: '50px' }}/>
        </div>
        <div className={classes.card}>
          <div>
            <h2 style={{color: 'blue', fontWeight: '700'}}>{currentTemperature} °C</h2>
            <p>Ambient Temperature</p>
          </div>
          <img src='/static/image/temperature_icon.png' style={{ height: '50px' }}/>
        </div>
      </div>
      {/* <h3>Forecasting Information</h3> */}
      <div className={classes.chartContainer}>
        <div className={classes.chart}>
          <div className={classes.chartHeader}>
            <DatePicker
              defaultValue={dayjs(moment().format(dateFormat), dateFormat)}
              onChange={onChangeIrradianceDate}
              picker='date'
              maxDate={dayjs(moment().format(dateFormat), dateFormat)}
            />
          </div>
          <div className={classes.chartContent}>
            <h3>Irradiation</h3>
            <LineChart data={dniData} measure={'W/m2'} graphStep={100} />
          </div>
        </div>
        <div className={classes.chart}>
          <div className={classes.chartHeader}>
            <DatePicker
              defaultValue={dayjs(moment().format(dateFormat), dateFormat)}
              onChange={onChangeTemperatureDate}
              picker='date'
              maxDate={dayjs(moment().format(dateFormat), dateFormat)}
            />
          </div>
          <div className={classes.chartContent}>
            <h3>Ambient Temperature</h3>
            <LineChart data={temperatureData} measure={'°C'} graphStep={5} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather