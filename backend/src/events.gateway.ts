import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

/**
 * Method tells when server initialized
 * @param server 
 */
  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  /**
   * Connection id is assigned when client connected
   * @param client 
   */
  handleConnection(client: any) {
    console.log('Client connected:', client.id);
  }

  /**
   * Connetion Id with client disconnected shown
   * @param client 
   */
  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
/**
 * triggers and emits recipe-added socket
 * @param recipe 
 */
  @SubscribeMessage('recipe-added')
  handleRecipeAdded(@MessageBody() recipe: any) {
    console.log('Recipe added:', recipe);
    // Broadcast the new recipe to all clients
    this.server.emit('recipe-added', recipe);
  }
}
