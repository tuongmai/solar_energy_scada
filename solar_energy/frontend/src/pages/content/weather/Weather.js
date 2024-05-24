import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Table } from 'antd'

const Weather = () => {
  const view = useSelector(state => state.view.view)

  return (
    <div>
      Weather page
    </div>
  )
}

export default Weather