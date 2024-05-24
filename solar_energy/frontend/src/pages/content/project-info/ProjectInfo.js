import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Space, Table } from 'antd'

const ProjectInfo = () => {
  const view = useSelector(state => state.view.view)

  return (
    <div>
      ProjectInfo page
    </div>
  )
}

export default ProjectInfo