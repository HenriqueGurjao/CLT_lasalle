"use client"

import React, { useEffect, useState } from 'react';

const useDeviceOrientation = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    const mobileDevices = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;

    // Detect if the device is mobile
    setIsMobile(mobileDevices.test(userAgent));

    // Function to update orientation state
    const updateOrientation = () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    };

    // Add event listener to listen for orientation changes
    window.addEventListener('resize', updateOrientation);

    // Set the initial orientation
    updateOrientation();

    // Clean up event listener on component unmount
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);

  return { isMobile, orientation };
};

const DeviceOrientationComponent = () => {
  const { isMobile, orientation } = useDeviceOrientation();

  return (
    <div>
      {isMobile ? (
        <p>The device is a mobile device.</p>
      ) : (
        <p>The device is not a mobile device.</p>
      )}
      <p>The current orientation is {orientation}.</p>
    </div>
  );
};

export default DeviceOrientationComponent;