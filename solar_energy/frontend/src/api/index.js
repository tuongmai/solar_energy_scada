import axios from 'axios'

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