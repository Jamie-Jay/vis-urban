import React from "react";
import { layerControl } from '../helper/style';

export const TimerComp = (props) => {

  const {currentTimeObj, timerRun, setTimerRun, currMinTime, currMaxTime, OtherItems} = props

  return (
    <span style={{...layerControl, right: '600px'}}>
      <div style={{ width: '100%', marginTop: "1rem" }}>
        <b>Trace & Animation Controller</b>
        <input
          style={{ width: '100%' }}
          type="range"
          min={currMinTime}
          max={currMaxTime}
          step="0.1"
          value={currentTimeObj.getCurrentTime()}
          readOnly
          onChange={ e => { currentTimeObj.setCurrentTime(Number(e.target.value)); }}
        />
        <div style={{ 
            display: 'flex',
            flexDirection: 'row' ,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <button onClick={ e => { 
              if (timerRun) {
                currentTimeObj.pauseTimer(); setTimerRun(false)
              } else {
                currentTimeObj.continueTimer(); setTimerRun(true)
              }
            }}>{timerRun ? ' pause ' : 'continue'}</button>
          <button onClick={ e => { currentTimeObj.stopTimer(); setTimerRun(false) }}>stop</button>
          <button onClick={ e => { currentTimeObj.reStartTimer(); setTimerRun(true) }}>re-start</button>
        </div>
        <OtherItems />
      </div>
    </span>
    )
}