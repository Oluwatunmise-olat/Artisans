import { Controller } from '@nestjs/common';

@Controller('core')
export class CoreController {
  async createServiceRequest() {
    throw new Error('Method not implemented');
  }

  async createServiceFeedback() {
    throw new Error('Method not implemented');
  }

  async getActivityLogs() {
    throw new Error('Method not implemented');
  }

  async getServiceRequests() {
    throw new Error('Method not implemented');
  }

  async getServiceRequestDetail() {
    throw new Error('Method not implemented');
  }

  async respondToServiceRequests() {
    throw new Error('Method not implemented');
  }

  // logging
  // exception handlers
  // tests -> e2e,integration,unittest
  // scheduled requests
}
