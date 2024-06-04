import {useEffect, useState} from 'react';
import servicesettings from '../modules/dataservices/servicesettings';
import {useSelector} from 'react-redux';
import {useUser} from './useUser';

const useFetchData = apiConfigs => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useUser();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(
          apiConfigs.map(async config => {
            const {endpoint, method, body} = config;

            const headerFetch = {
              method: method || 'POST',
              body: JSON.stringify(
                endpoint == 'mybundlings'
                  ? {...body, id: user.orgid}
                  : body || {},
              ),
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: servicesettings.AuthorizationKey,
              },
            };

            const response = await fetch(
              `${servicesettings.baseuri}${endpoint}`,
              headerFetch,
            );
            const result = await response.json();

            return {[endpoint]: result.data};
          }),
        );

        const mergedResults = results.reduce(
          (acc, result) => ({...acc, ...result}),
          {},
        );
        setData(mergedResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiConfigs]);

  return {data, loading, error};
};

export default useFetchData;
