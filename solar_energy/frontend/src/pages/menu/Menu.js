import React from 'react'
import { useDispatch } from 'react-redux'
import { setView } from '../../redux/view/reducer'
import useStyleMenu from './style'
import {
  HomeFilled,
  SignalFilled
} from '@ant-design/icons'

export const Menu = () => {
  const classes = useStyleMenu()
  const dispatch = useDispatch()

  const menuItem = {
    home: { label: 'Home', value: 'home' },
    project: { label: 'Project', value: 'project' },
    factory: { label: 'Factory', value: 'factory' },
    projectInfo: { label: 'Info', value: 'project-info' },
    weather: { label: 'Weather', value: 'weather' },
    prediction: { label: 'Prediction', value: 'prediction' },
  }

  const handleClickHome = () => {
    const value = menuItem.home.value
    document.getElementById(value).style.backgroundColor = '#007bff'
    document.getElementById('project').style.backgroundColor = 'transparent'
    document.getElementById('factory').style.backgroundColor = 'transparent'
    document.getElementById('project-info').style.backgroundColor = 'transparent'
    document.getElementById('weather').style.backgroundColor = 'transparent'
    document.getElementById('prediction').style.backgroundColor = 'transparent'

    document.getElementById('factory').style.color = 'rgba(255, 255, 255, 0.8)'
    document.getElementById('project-info').style.color = 'rgba(255, 255, 255, 0.8)'
    document.getElementById('weather').style.color = 'rgba(255, 255, 255, 0.8)'
    document.getElementById('prediction').style.color = 'rgba(255, 255, 255, 0.8)'
    dispatch(setView(value))
  }

  const handleClickSubItem = (value) => {
    document.getElementById('home').style.backgroundColor = 'transparent'
    document.getElementById('project').style.backgroundColor = '#007bff'
    document.getElementById('factory').style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
    document.getElementById('project-info').style.backgroundColor = 'transparent'
    document.getElementById('weather').style.backgroundColor = 'transparent'
    document.getElementById('prediction').style.backgroundColor = 'transparent'
    document.getElementById('project-info').style.color = 'rgba(255, 255, 255, 0.8)'
    document.getElementById('weather').style.color = 'rgba(255, 255, 255, 0.8)'
    document.getElementById('prediction').style.color = 'rgba(255, 255, 255, 0.8)'

    document.getElementById('factory').style.color = '#343a40'
    document.getElementById(value).style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
    document.getElementById(value).style.color = '#343a40'
    dispatch(setView(value))
  }

  return (
    <div className={classes.menu}>
      <div className={classes.menuTitle}>System Menu</div>
      <div className={classes.menuItem}>
        <ul>
          <li>
            <div className={classes.mainItem} style={{ backgroundColor: '#007bff' }} id='home' onClick={handleClickHome}>
              <HomeFilled />
              <span>Home</span>
            </div>
          </li>
          <li>
            <div className={classes.mainItem} id='project'>
              <SignalFilled />
              <span>Project</span>
            </div>
            <ul>
              <li>
                <div className={classes.subItem} id='factory'>
                  <div className='circle'></div>
                  <span>Rental factory 1</span>
                </div>
                <ul>
                  <li className={classes.subsubItem} id='project-info' onClick={() => handleClickSubItem(menuItem.projectInfo.value)}>
                    <div className='square'></div>
                    <span>Info</span>
                  </li>
                  <li className={classes.subsubItem} id='weather' onClick={() => handleClickSubItem(menuItem.weather.value)}>
                    <div className='square'></div>
                    <span>Weather</span>
                  </li>
                  <li className={classes.subsubItem} id='prediction' onClick={() => handleClickSubItem(menuItem.prediction.value)}>
                    <div className='square'></div>
                    <span>Prediction</span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}