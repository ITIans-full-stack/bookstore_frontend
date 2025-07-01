import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:5000',
  options: {
    transports: ['websocket']
  }
};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
  importProvidersFrom(SocketIoModule.forRoot(socketIoConfig)),
  provideNgxStripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk')]
};
