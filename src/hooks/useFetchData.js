import { useEffect, useState } from 'react';
import servicesettings from '../modules/dataservices/servicesettings';
import { useSelector } from 'react-redux';
import { useUser } from './useUser';

const useFetchData = apiConfigs => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(
          apiConfigs.map(async config => {
            const { endpoint, method, body } = config;

            const headerFetch = {
              method: method || 'POST',
              body: JSON.stringify(
                endpoint == 'admin/custombundlingdetails'
                  ? { ...body, id: isAuthenticated ? user.orgid : 0 }
                  : body || {},
              ),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: servicesettings.AuthorizationKey,
              },
            };
            // console.log('headerFetch', headerFetch);
            const response = await fetch(
              `${servicesettings.baseuri}${endpoint}`,
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
            // console.log(endpoint?.split('/'));
            return {
              [endpoint === 'admin/custombundlingdetails'
                ? 'mybundlings'
                : endpoint?.split?.('/')?.[1]]: result.data,
            };
          }),
        );
        const mergedResults = results.reduce(
          (acc, result) => ({ ...acc, ...result }),
          {},
        );
        setData(mergedResults);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  return { data, loading, error };
};

export default useFetchData;
