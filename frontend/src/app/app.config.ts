import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { SocketIoModule,SocketIoConfig } from 'ngx-socket-io';
const socketConfig: SocketIoConfig = {
  url: 'http://localhost:5000',
  options: {}
};
// import { provideNgxStripe } from 'ngx-stripe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideHttpClient(),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig))
  ]
};
// provideNgxStripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk')