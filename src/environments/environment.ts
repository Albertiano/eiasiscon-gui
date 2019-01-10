export const environment = {
  production: false,
  apiUrl: 'http://192.168.0.10:100/api',

  tokenWhitelistedDomains: [
    new RegExp('localhost:8090'),
    new RegExp('192.168.0.10:100'),
    new RegExp('eiasiscon.com.br')
  ],
  tokenBlacklistedRoutes: [ new RegExp('\/auth\/login'), new RegExp('\/auth\/token') ]
};