import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "./api.config.service";
import { ApiService } from "./api.service";

@Injectable()
export class VmQueryService {
  constructor(
    private readonly apiService: ApiService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async vmQuery(contract: string, func: string, caller: string | undefined, args: string[] = []): Promise<any> {
    let payload = { 
      scAddress: contract, 
      funcName: func, 
      caller: caller, 
      args: args,
    };

    let result = await this.apiService.post(
      `${this.apiConfigService.getApiUrl()}/vm-values/query`,
      payload,
    );

    return result.data;
  };
}