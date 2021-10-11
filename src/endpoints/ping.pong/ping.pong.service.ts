import { Address } from "@elrondnetwork/erdjs/out";
import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "src/common/api.config.service";
import { CachingService } from "src/common/caching.service";
import { Constants } from "src/common/utils/constants";
import { VmQueryService } from "src/common/vm.query.service";

@Injectable()
export class PingPongService {
  constructor(
    private readonly cachingService: CachingService,
    private readonly vmQueryService: VmQueryService,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async getTimeToPong(address: Address): Promise<{ status: string, timeToPong?: number }> {
    const pongDeadlineTimestamp = await this.getPongDeadline(address);
    if (!pongDeadlineTimestamp) {
      return { status: "not_yet_pinged" };
    }

    let pongDeadline = new Date(pongDeadlineTimestamp);

    let secondsRemaining = (pongDeadline.getTime() - new Date().getTime()) / 1000;
    if (secondsRemaining < 0) {
      secondsRemaining = 0;
    }

    return { status: "awaiting_pong", timeToPong: secondsRemaining };
  }

  async getPongDeadline(address: Address): Promise<number | null> {
    return await this.cachingService.getOrSetCache(
      `pong:${address}`,
      async () => await this.getPongDeadlineRaw(address),
      Constants.oneMinute() * 10,
    );
  }

  async getPongDeadlineRaw(address: Address): Promise<number | null> {
    const secondsToPong = await this.queryTimeToPong(address);
    if (secondsToPong === undefined) {
      return null;
    }

    let date = new Date();
    date.setSeconds(date.getSeconds() + secondsToPong);

    return date.getTime();
  }

	async queryTimeToPong(address: Address): Promise<number | undefined> {
		const result = await this.vmQueryService.vmQuery(
      this.apiConfigService.getPingPongContract(),
      'getTimeToPong',
      undefined,
      [ address.hex() ]
    );


    let returnData = result.data.returnData;
    if (returnData.length === 0) {
      return undefined;
    }

    if (returnData[0] === '') {
      return 0;
    }

    return parseInt(Buffer.from(returnData[0], 'base64').toString('hex'), 16);
	}
}