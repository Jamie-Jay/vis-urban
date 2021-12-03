import { useState, useEffect } from 'react';

export const WithTime = (endAt, speedRate = 1, delay = 60) => {

    // The key in all of this is the currentTime variable. 
    // This variable tells DeckGL which path coordinate to render, based on the the corresponding timestamp.
    const [time, setTime] = useState(0);
    const animationSpeed = 1;
    /*
    // use timeinteval to implement animation
    // the animation will likely start to break down and become "choppy". 
    // This generally tends to happen if it takes longer to execute the loop than the interval (intervals will start getting backed up).
    const intervalMS = 1000;
    useEffect(() => {
      const interval = setInterval(() => {
        if (endAt > 0) {
          // console.log('time', time)
          setTime(t => (t + animationSpeed) 
          // % endAt
          );
        }
      }, intervalMS);
    
      return () => clearInterval(interval);
    }, [endAt]);
    */

    // use window.requestAnimationFrame function
    // it allows the browser to request the interval when it's ready (based on how long the previous loop took to render).
    // https://css-tricks.com/using-requestanimationframe/
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    // http://creativejs.com/resources/requestanimationframe/
    const [animation] = useState({});

    const animate = () => {
      setTime(t => (t + animationSpeed) % Math.ceil(endAt * speedRate));
      animation.id = window.requestAnimationFrame(animate);
    };

    useEffect(
      () => {
        if (endAt > 0) {
          animation.id = window.requestAnimationFrame(animate);
        }
        return () => window.cancelAnimationFrame(animation.id);
      },
      [animation, endAt]
    );

    const [timeOutput, setTimeOutput] = useState(0);
    useEffect(
      () => {
        if (time % speedRate === 0) {
          setTimeOutput(time / speedRate)
        }
      },
      [time]
    );

    function getCurrentTime () {
      return timeOutput; // Slow down the animation speed
      // console.log('time output', Math.max(time - delay, 0), animationSpeed, endAt);
      // return Math.max(time - delay, 0); // use setInterval to mimic one minute delay
    }

    function setCurrentTime (newTime) {
      setTime(newTime * speedRate);
    }

    return {
      getCurrentTime: getCurrentTime,
      setCurrentTime: setCurrentTime
    }
}
