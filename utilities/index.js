const path = require('path');
const {existsSync, readFileSync} = require('fs');

const sslKeyCert = () => {
  const key = readFileSync(getSSLKeyPath());
  const cert = readFileSync(getSSLCertPath());

  return {key, cert};
}

const getSSLKeyPath = () => {
  const keyFile = path.resolve(__dirname, 'ssl.key')
  return existsSync(keyFile)
    ? keyFile
    : path.resolve(__dirname, 'localhost.key');
}

const getSSLCertPath = () => {
  const crtFile = path.resolve(__dirname, 'ssl.crt')
  return existsSync(crtFile)
    ? crtFile
    : path.resolve(__dirname, 'localhost.crt');
}

module.exports = {
  sslKeyCert,
  getSSLKeyPath,
  getSSLCertPath,
};