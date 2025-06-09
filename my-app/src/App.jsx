import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HandleDispatchPage from './Components/HandleDispatchPage';
import BadVehicle from './Components/BadVehicle'
import Vehicle from './Components/Vehicle'

const App = () => {
  return (
      <div>
       {/* <HandleDispatchPage /> */}
       <BadVehicle/>
       {/* <Vehicle /> */}
      </div>
        )
}

export default App 