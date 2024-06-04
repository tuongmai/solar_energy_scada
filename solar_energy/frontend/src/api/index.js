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
    // const res = await axios.post('http://sol-scada.com/DataRealTime/Read', fields)
    // const res = await axios.post('http://127.0.0.1:8000/proxy/', {
    //     data: fields
    // })
    const res = await axios({
        method: 'POST',
        url: 'http://sol-scada.com/DataRealTime/Read',
        // url: 'http://127.0.0.1:8000/proxy/',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Access-Control-Allow-Origin': '*'
        // },
        data: fields,
        withCredentials: false
    })
    return res
    // const fetchPromise = fetch("http://sol-scada.com/DataRealTime/Read", {
    //     method: "POST",
    //     mode: "cors",
    //     headers: {
    //         "Content-Type": "text/xml",
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     body: fields,
    // });

    // fetchPromise.then((response) => {
    //     console.log(response.status);
    // });

}

export const getWeatherForecast = async (start_date, end_date) => {
    const res = await axios.get('http://127.0.0.1:8080/weather_forecast', {
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
    const res = await axios.get('http://127.0.0.1:8080/predict', {
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
            ambient: Number(data.ambient_temparature[key]?.toFixed(2)),
            temperature: Number(data.temparature[key]?.toFixed(2)),
            power: data.irradiance[key] > 0 ? Number(data.power[key]?.toFixed(2)) : 0
        })
    })
    return returnData
}