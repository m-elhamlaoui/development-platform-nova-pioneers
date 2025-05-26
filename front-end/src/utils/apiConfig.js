const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';
  
  return isLocalhost 
    ? 'http://localhost:9094/api' 
    : 'http://141.144.226.68:9094/api';
};

export default {
  base: getApiBaseUrl(),
  teachers: `${getApiBaseUrl()}/teachers`,
  courses: `${getApiBaseUrl()}/courses`,
  modules: `${getApiBaseUrl()}/modules`,
  lessons: `${getApiBaseUrl()}/lessons`
};