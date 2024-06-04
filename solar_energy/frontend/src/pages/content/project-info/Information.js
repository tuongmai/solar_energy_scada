import React, { useEffect } from "react"

import { getDataRealTime } from "../../../api"

const Information = () => {
  const fields = [
    "Project1PowerMeter.ActivePower",
    "Project1PowerMeter.ReactivePower",
    "ITNProject1Common.DailyEnergy",
    "ITNProject1Common.MonthlyEnergy",
    "ITNProject1Common.YearlyEnergy",
    "Project1PowerMeter.TotalEnergy",
    "ITNProject1Common.TotalInverterON",
    "ITNProject1Common.TotalInverterOFF",
    "ITNProject1Common.TotalInverterFault",
    "ITNProject1Common.TotalInverterStandby",
    "Project1Inverter1.OutputActivePower",
    "Project1Inverter2.OutputActivePower",
    "Project1Inverter3.OutputActivePower",
    "Project1Inverter4.OutputActivePower",
    "Project1Inverter5.OutputActivePower",
    "Project1Inverter6.OutputActivePower",
    "Project1Inverter7.OutputActivePower",
    "Project1Inverter8.OutputActivePower"
  ]

  useEffect(() => {
    getDataRealTime(fields)
      .then(res => console.log('info: ', res))
  }, [])

  return (
    <div>

    </div>
  )
}

export default Information