import { useEffect, useState } from 'react';

const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // TEST: Kızılay Mall
    setTimeout(() => {
      setLocation({
        latitude: 39.920824,
        longitude: 32.854047
      });
    }, 1000);
  }, []);

  return { location, errorMsg };
};

export default useLocation;