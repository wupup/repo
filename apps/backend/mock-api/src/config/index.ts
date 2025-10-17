// src/config.ts
export const config = {
  port: process.env.PORT || 9527,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
};
