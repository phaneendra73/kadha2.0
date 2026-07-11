export const getenv = (name) => {
  if (name === 'APIURL') {
    return import.meta.env.VITE_APIURL || '/api';
  }
  if (name === 'BLOGSLIMIT') {
    return import.meta.env.VITE_BLOGSLIMIT || 10;
  }
  return import.meta.env[`VITE_${name}`];
};
