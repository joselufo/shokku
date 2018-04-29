import ShokkuNetworksFactory from '@/networks/shokku-networks.factory'
import { Component } from '@nestjs/common'

export class NetworkProvider {
  constructor(readonly id: string, readonly networks: Map<string, NetworkChain>) {}
}

export interface NetworkChain {
  id(): string
  blacklistedDomains(): string[]
  exchangeSupportedTickers(): string[]
  validRpcMethods(options?: RpcMethodsOptions)
}

export class RpcMethodsOptions {
  readonly formatted?: boolean = true
}

export class NetworkProviderNotFound extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, NetworkProviderNotFound)
  }
}

export class NetworkChainNotFound extends Error {
  constructor(...args) {
    super(...args)
    Error.captureStackTrace(this, NetworkChainNotFound)
  }
}

@Component()
export class NetworksRepository {
  private readonly networks: Map<string, NetworkProvider>

  constructor() {
    this.networks = ShokkuNetworksFactory.create()
  }

  getNetworkProvider(networkId: string): NetworkProvider {
    const provider = this.networks.get(networkId)
    if (!provider) {
      throw new NetworkProviderNotFound(`${networkId} is not a valid network provider`)
    }
    return provider
  }

  getNetworkChain(networkId: string, chainId: string): NetworkChain {
    const provider = this.getNetworkProvider(networkId)
    const chain = provider.networks.get(chainId)
    if (!chain) {
      throw new NetworkChainNotFound(`${chainId} is not a valid network chain`)
    }
    return chain
  }

  hasNetworkChain(networkId: string, chainId: string): boolean {
    try {
      return this.getNetworkChain(networkId, chainId) != null
    } catch (error) {
      return false
    }
  }

  getAllNetworkProviders(): NetworkProvider[] {
    return Array.from(this.networks.values())
  }
}