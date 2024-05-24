import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SunFilled } from '@ant-design/icons'
import useStyleContent from './style'

import Home from './home/Home'
import ProjectInfo from './project-info/ProjectInfo'
import Weather from './weather/Weather'
import Prediction from './prediction/Prediction'

const Content = () => {
  const view = useSelector(state => state.view.view)
  const classes = useStyleContent()

  return (
    <div className={classes.content}>
      <div className={classes.title}>
        <SunFilled style={{ color: 'orange' }} />
        <span>SOLAR SCADA SYSTEM</span>
      </div>
      { (view === 'home') && <Home/> }
      { (view === 'project-info') && <ProjectInfo/> }
      { (view === 'weather') && <Weather/> }
      { (view === 'prediction') && <Prediction/> }
    </div>
  )
}

export default Content