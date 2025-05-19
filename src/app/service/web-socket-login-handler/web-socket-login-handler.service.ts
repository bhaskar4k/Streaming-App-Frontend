import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import { Router } from '@angular/router';
import { EndpointWebsocket } from '../../endpoints/endpoints';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class WebSocketLoginHandlerService {
  private client!: Client;
  private connected = false;
  private timeoutRef: any;
  private JWT: any;

  constructor(private router: Router, private authService: AuthenticationService) { }

  public setupWebSocket() {
    debugger;
    console.log(this.authService.getToken());

    this.JWT = this.authService.getToken();
    if (!this.JWT) {
      this.router.navigate(['login']);
      return;
    }

    this.JWT = JSON.parse(this.JWT);
    if (!this.JWT.device_endpoint) {
      this.router.navigate(['login']);
      return;
    }

    this.client = new Client({
      brokerURL: `${EndpointWebsocket.authentication_websocket}${EndpointWebsocket.get_websocket_emit}`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        this.connected = true;
        console.log('Connected: ', frame);

        this.client.subscribe(`${EndpointWebsocket.get_logout_emit}${this.JWT.device_endpoint}`, (response: IMessage) => {
          const payload = JSON.parse(response.body);
          if (payload.data === "logout_" + this.JWT.device_endpoint) {
            //openAlertModal("Login", payload.message);

            this.timeoutRef = setTimeout(() => {
              //closeAlertModal();
              localStorage.removeItem("JWT");
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 500);
            }, 5000);
          }
        });
      },
      onStompError: frame => {
        console.error('STOMP Error', frame.body);
      },
      onWebSocketError: err => {
        console.error('WebSocket error', err);
        this.connected = false;
      },
      onDisconnect: () => {
        this.connected = false;
      }
    });

    this.client.activate();
  }

  public disconnect() {
    if (this.client && this.client.active) {
      this.client.deactivate();
    }
  }
}
