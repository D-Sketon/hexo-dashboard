import React, { useState, useEffect } from 'react';

function SinceWhen({ time, prefix = '' }) {
  const [currentTime, setCurrentTime] = useState(time.fromNow());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(time.fromNow());
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <span>{prefix + currentTime}</span>;
}

export default SinceWhen;