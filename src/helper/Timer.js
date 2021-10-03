import { useState, useEffect } from 'react';

export const WithTime = (maxTime) => {

    // The key in all of this is the currentTime variable. 
    // This variable tells DeckGL which path coordinate to render, based on the the corresponding timestamp.
    const [time, setTime] = useState(0);
    const animationSpeed = 1;
    /*
    // use timeinteval to implement animation
    // the animation will likely start to break down and become "choppy". 
    // This generally tends to happen if it takes longer to execute the loop than the interval (intervals will start getting backed up).
    const intervalMS = 20;
    useEffect(() => {
      const interval = setInterval(() => {
        setTime(t => (t + animationSpeed) % loopLength);
      }, intervalMS);
    
      return () => clearInterval(interval);
    }, []);
    */

    // use window.requestAnimationFrame function
    // it allows the browser to request the interval when it's ready (based on how long the previous loop took to render).
    // https://css-tricks.com/using-requestanimationframe/
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    const [animation] = useState({});

    const animate = () => {
      setTime(t => (t + animationSpeed) % maxTime);
      animation.id = window.requestAnimationFrame(animate);
    };

    useEffect(
      () => {
        animation.id = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(animation.id);
      },
      [animation, maxTime]
    );

    function getCurrentTime () {
      return time;
    }

    function setCurrentTime (newTime) {
      setTime(newTime);
    }

    return {
      getCurrentTime: getCurrentTime,
      setCurrentTime: setCurrentTime
    }
}
