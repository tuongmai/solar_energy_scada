import React, { useEffect, useState } from 'react'
import { getWeatherInfo } from './api'
import { Menu } from './pages/menu/Menu'
import Content from './pages/content/Content'

function App() {
  const [weather, setWeather] = useState()

  const getInfo = async () => {
    const w = await getWeatherInfo()
    setWeather(w)
  }

  useEffect(() => {
    getInfo()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Menu/>
      <Content/>
    </div>
  )
}

export default App