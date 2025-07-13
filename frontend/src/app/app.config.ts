import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideAnimations } from '@angular/platform-browser/animations';
const socketIoConfig: SocketIoConfig = {
  url: 'http://localhost:5000',
  options: {
    transports: ['websocket'],
    withCredentials: true
  }
};


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(),
  importProvidersFrom(SocketIoModule.forRoot(socketIoConfig),ToastrModule.forRoot(),
      SweetAlert2Module.forRoot()),
  provideNgxStripe('pk_test_51RRAPZPh6I2dCw4UwbapbzAKwyPBa9UqzjMfGssEjKsvfZEx9emvjiuGY5FP0tN4wG2yG25xs16aK2fhaSkKJ8sg00cKkQz1wk'),
  provideAnimations(),
]
};
