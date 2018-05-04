import { NetworkChain } from '@/core/decorators'
import { NetworkChainRequestEntity } from '@/core/entities'
import { HttpExceptionAdapter } from '@/core/exceptions'
import TickerService from '@/server/ticker/ticker.service'
import TickerValidationPipe from '@/server/ticker/ticker.validation.pipe'
import { Controller, Get, Param, UsePipes } from '@nestjs/common'

@Controller('ticker')
export default class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get(':network/:chain/symbols')
  symbols(@NetworkChain() req: NetworkChainRequestEntity<any>) {
    try {
      return this.tickerService.symbols(req)
    } catch (error) {
      throw HttpExceptionAdapter.toHttpException(error)
    }
  }

  @Get(':network/:chain/:symbol')
  @UsePipes(new TickerValidationPipe())
  async symbol(@NetworkChain() req: NetworkChainRequestEntity<any>, @Param('symbol') params) {
    const symbol = params.symbol
    try {
      return await this.tickerService.symbol(req, symbol)
    } catch (error) {
      throw HttpExceptionAdapter.toHttpException(error)
    }
  }
}
