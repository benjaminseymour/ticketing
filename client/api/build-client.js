import axios from 'axios';

const BuildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // server
    return axios.create({
      baseURL: 'http://imbe.nz/',
      headers: req.headers,
    });
  }

  // browser
  return axios.create({
    baseURL: '/',
  });
};

export default BuildClient;
