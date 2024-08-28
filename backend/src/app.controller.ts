import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  /**
   * Function as a random checker
   * @returns hello
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
