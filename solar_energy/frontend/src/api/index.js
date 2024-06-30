import axios from 'axios'
import * as moment from 'moment'

export const getWeatherInfo = async () => {
    return 'weather info'
}

export const getProjectSolarEnergy = async (timeUnit, starttime, endtime) => {
    const res = await axios.get('http://sol-scada.com/DataProject/GetProjectSolarEnergy', {
        params: {
            ProjectName: 'project1',
            timeUnit,
            starttime,
            endtime
        }
    })
    return res
}

export const getProjectSolarPower = async (datetime) => {
    const res = await axios.get('http://sol-scada.com/DataProject/GetProjectSolarPower', {
        params: {
            ProjectName: 'project1',
            datetime
        }
    })
    return res
}

export const getDataRealTime = async (fields) => {
    const res = await axios({
        method: 'POST',
        url: 'http://sol-scada.com/DataRealTime/Read',
        data: fields,
        withCredentials: false
    })
    return res
}

export const getWeatherForecast = async (start_date, end_date) => {
    const res = await axios.get('/weather_forecast', {
        params: {
            start_date,
            end_date
        }
    })
    const data = JSON.parse(res.data.data)
    let returnData = []
    Object.keys(data.date).forEach(key => {
        returnData.push({
            date: data.date[key],
            dni: Number(data.direct_normal_irradiance[key].toFixed(2)),
            temperature: Number(data.temperature_2m[key].toFixed(2))
        })
    })
    return returnData
}

export const getPredictPower = async (start_date, end_date) => {
    const res = await axios.get('/predict', {
        params: {
            start_date,
            end_date
        }
    })
    const data = JSON.parse(res.data.data)
    let returnData = []
    Object.keys(data.date).forEach(key => {
        returnData.push({
            date: moment(data.date[key]).valueOf(),
            dni: Number(data.irradiance[key]?.toFixed(2)),
            temperature: Number(data.ambient_temparature[key]?.toFixed(2)),
            // soil_temperature: Number(data.temparature[key]?.toFixed(2)),
            power: data.irradiance[key] > 0 ? Number(data.power[key]?.toFixed(2)) : 0
        })
    })
    return returnData
}