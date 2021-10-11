import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigService {
  constructor(private readonly configService: ConfigService) {}

  getApiUrl(): string {
    const apiUrl = this.configService.get<string>('urls.api');
    if (!apiUrl) {
      throw new Error('No API url present');
    }

    return apiUrl;
  }

  getSwaggerUrls(): string[] {
    const swaggerUrls = this.configService.get<string[]>('urls.swagger');
    if (!swaggerUrls) {
      throw new Error('No swagger urls present');
    }

    return swaggerUrls;
  }

  getRedisUrl(): string {
    const redisUrl = this.configService.get<string>('urls.redis');
    if (!redisUrl) {
      throw new Error('No redisUrl present');
    }

    return redisUrl;
  }

  getIsPublicApiFeatureActive(): boolean {
    let isApiActive = this.configService.get<boolean>('features.publicApi');
    if (isApiActive === undefined) {
      throw new Error('No public api feature flag present');
    }

    return isApiActive;
  }

  getIsPrivateApiFeatureActive(): boolean {
    let isApiActive = this.configService.get<boolean>('features.privateApi');
    if (isApiActive === undefined) {
      throw new Error('No private api feature flag present');
    }

    return isApiActive;
  }

  getIsTransactionProcessorFeatureActive(): boolean {
    let isTransactionProcessorActive = this.configService.get<boolean>('features.transactionProcessor');
    if (isTransactionProcessorActive === undefined) {
      throw new Error('No transaction processor feature flag present');
    }

    return isTransactionProcessorActive;
  }

  getPingPongContract(): string {
    const pingPongContract = this.configService.get<string>('contracts.pingPong');
    if (!pingPongContract) {
      throw new Error('No pingPong contract present');
    }

    return pingPongContract;
  }
}