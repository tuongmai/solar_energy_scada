import React, { useState } from 'react'
import { Table } from 'antd'
import useStyleHome from './style'

const Home = () => {
  const [powerData, setPowerData] = useState([{ plant: 'Rental Factory 1', gridDate: '2023-07-10', currentPower: '--', yieldToday: '--', totalYield: '--'}])
  const classes = useStyleHome();

  const infoColumns = [
    {
      title: 'General information of rooftop',
      dataIndex: 'generalInfo',
      key: 'generalInfo',
      align: 'center',
      width: '50%'
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      align: 'center',
      width: '50%'
    }
  ]

  const infoData = [
    {
      key: 1,
      generalInfo: 'Installed DC Power',
      detail: '2.4 MWp'
    },
    {
      key: 2,
      generalInfo: 'Number of installed rooftop project',
      detail: '2'
    },
    {
      key: 3,
      generalInfo: 'Number of Inverter',
      detail: '17'
    }
  ]

  const powerColumns = [
    {
      title: 'Plant',
      dataIndex: 'plant',
      key: 'plant',
      align: 'center',
      width: '20%'
    },
    {
      title: 'Connection Grid Date',
      dataIndex: 'gridDate',
      key: 'gridDate',
      align: 'center',
      width: '20%'
    },
    {
      title: 'Current Power (kW)',
      dataIndex: 'currentPower',
      key: 'currentPower',
      align: 'center',
      width: '20%'
    },
    {
      title: 'Yield Today',
      dataIndex: 'yieldToday',
      key: 'yieldToday',
      align: 'center',
      width: '20%'
    },
    {
      title: 'Total Yield',
      dataIndex: 'totalYield',
      key: 'totalYield',
      align: 'center',
      width: '20%'
    },
  ]

  return (
    <div className={classes.page}>
      <div className={classes.info}>
        <Table columns={infoColumns} dataSource={infoData} pagination={false} bordered />
        <Table columns={powerColumns} dataSource={powerData} pagination={false} bordered />
      </div>
      <div className={classes.map}>
        <img src='/static/image/anh_VN.jpg' style={{ height: '100%' }} />
        <img src='/static/image/info.png' className={classes.infoImage} />
      </div>
    </div>
  )
}

export default Home