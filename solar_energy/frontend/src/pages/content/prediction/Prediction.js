import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Table } from 'antd'

const Prediction = () => {
  const view = useSelector(state => state.view.view)

  return (
    <div>
      Prediction page
    </div>
  )
}

export default Prediction