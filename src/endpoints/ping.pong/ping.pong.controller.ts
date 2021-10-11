import { Address } from "@elrondnetwork/erdjs/out";
import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { PingPongService } from "./ping.pong.service";

@Controller('ping-pong')
@ApiTags('ping-pong')
export class PingPongController {
	constructor(
    private readonly pingPongService: PingPongService
  ) {}

	@Get("/time-to-pong/:address")
	@ApiResponse({
		status: 200,
		description: 'Returns one example',
	})
  async getTimeToPong(
    @Param('address') address: string,
	): Promise<{ status: string, timeToPong?: number }> {
    let erdAddress: Address;
    try {
      erdAddress = new Address(address);
    } catch (error) {
      throw new BadRequestException('Invalid address format');
    }

    return await this.pingPongService.getTimeToPong(erdAddress);
	}
}