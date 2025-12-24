// src/config.js
export const config = {
  get port() {
    const port = process.env.PORT;
    return port ? parseInt(port, 10) : 8000;
  },
  get nodeEnv() {
    return process.env.NODE_ENV || 'development';
  },
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};
