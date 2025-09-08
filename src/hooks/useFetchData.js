import { useEffect, useState } from 'react';
import servicesettings from '../modules/dataservices/servicesettings';
import { useSelector } from 'react-redux';
import { useUser } from './useUser';

const useFetchData = apiConfigs => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useUser();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await Promise.all(
        apiConfigs.map(async config => {
          const { endpoint, method, body, key } = config;

          const headerFetch = {
            method: method || 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json; charset=utf-8',
              Authorization: servicesettings.AuthorizationKey,
            },
            ...(method === 'POST' && {
              body: JSON.stringify(
                endpoint === 'admin/custombundlingdetails'
                  ? { ...body, id: isAuthenticated ? user.orgId : 0 }
                  : body || {},
              ),
            }),
          };

          // console.log('headerFetch', headerFetch);
          const response = await fetch(
            key === 'ipinfo'
              ? endpoint
              : `${servicesettings.baseuri}${endpoint}`,
            headerFetch,
          );
          // console.log('response', response);

          if (!response.ok) {
            const error = new Error(
              `HTTP error! Status: ${response.status}, Message: ${response.statusText}`,
            );
            error.status = response.status; // Attach status to the error object
            throw error;
          }
          const result = await response.json();
          // console.log('result', result);
          if (key !== 'ipinfo' && !result?.status) {
            const error = new Error(result?.message || 'server error');
            throw error;
          }
          // console.log(endpoint?.split('/'));
          return {
            [key]: key === 'ipinfo' ? result : result.data,
          };
        }),
      );
      // console.log({ results });
      const mergedResults = results.reduce(
        (acc, result) => ({ ...acc, ...result }),
        {},
      );
      // console.log({ mergedResults });
      setData(mergedResults);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [isAuthenticated]);

  return { data, loading, error, fetchData };
};

export default useFetchData;
