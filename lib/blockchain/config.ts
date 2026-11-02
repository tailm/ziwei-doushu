export type ChainId = 'ethereum' | 'polygon' | 'bsc';
export type TokenSymbol = 'USDT' | 'USDC' | 'USDS';

export interface ChainConfig {
  id: number;
  name: string;
  name_cn: string;
  rpc_url_env: string;
  rpc_url_fallback: string;
  explorer_url: string;
  explorer_api: string;
  explorer_api_key_env: string;
  tokens: Record<TokenSymbol, string>;
}

export const RECEIVING_ADDRESS = process.env.WEB3_RECEIVING_ADDRESS || '0xEe964B82D61e51196Dd22Bf6dcB75Ea3D04a87a8';

export const POLL_INTERVAL = 30;
export const ORDER_TIMEOUT = 10 * 60;

export const CHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    name_cn: 'ETH',
    rpc_url_env: 'ETH_RPC_URL',
    rpc_url_fallback: 'https://rpc.ankr.com/eth/6f37f4d599585583f95fdc7665ed6cddd0628733205c1050e8ff50c41e70443b',
    explorer_url: 'https://etherscan.io',
    explorer_api: 'https://api.etherscan.io/api',
    explorer_api_key_env: 'ETHERSCAN_API_KEY',
    tokens: {
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
    },
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    name_cn: 'Polygon',
    rpc_url_env: 'POLYGON_RPC_URL',
    rpc_url_fallback: 'https://rpc.ankr.com/polygon/6f37f4d599585583f95fdc7665ed6cddd0628733205c1050e8ff50c41e70443b',
    explorer_url: 'https://polygonscan.com',
    explorer_api: 'https://api.polygonscan.com/api',
    explorer_api_key_env: 'POLYGONSCAN_API_KEY',
    tokens: {
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      USDS: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    },
  },
  bsc: {
    id: 56,
    name: 'BSC',
    name_cn: 'BSC',
    rpc_url_env: 'BSC_RPC_URL',
    rpc_url_fallback: 'https://rpc.ankr.com/bsc/6f37f4d599585583f95fdc7665ed6cddd0628733205c1050e8ff50c41e70443b',
    explorer_url: 'https://bscscan.com',
    explorer_api: 'https://api.bscscan.com/api',
    explorer_api_key_env: 'BSCSCAN_API_KEY',
    tokens: {
      USDT: '0x55d398326f99059fF775485246999027B3197955',
      USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      USDS: '0x55d398326f99059fF775485246999027B3197955',
    },
  },
};

export const TOKEN_DECIMALS: Record<TokenSymbol, Record<ChainId, number>> = {
  USDT: { ethereum: 6, polygon: 6, bsc: 18 },
  USDC: { ethereum: 6, polygon: 6, bsc: 18 },
  USDS: { ethereum: 18, polygon: 6, bsc: 18 },
};

export function getTokenDecimals(chain: ChainId, token: TokenSymbol): number {
  return TOKEN_DECIMALS[token][chain];
}

export const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a1162875576ce9f7c2de';

export function getRpcUrl(chain: ChainId): string {
  const config = CHAIN_CONFIGS[chain];
  return process.env[config.rpc_url_env] || config.rpc_url_fallback;
}

export function getReceivingAddress(): string {
  return RECEIVING_ADDRESS;
}

export function getTokenContract(chain: ChainId, token: TokenSymbol): string {
  return CHAIN_CONFIGS[chain].tokens[token];
}

export function getExplorerApiKey(chain: ChainId): string {
  const config = CHAIN_CONFIGS[chain];
  return process.env[config.explorer_api_key_env] || '';
}

export function getSupportedChains(): { id: ChainId; name_cn: string; chain_id: number }[] {
  return Object.entries(CHAIN_CONFIGS).map(([id, config]) => ({
    id: id as ChainId,
    name_cn: config.name_cn,
    chain_id: config.id,
  }));
}

export function getSupportedTokens(): TokenSymbol[] {
  return ['USDT', 'USDC', 'USDS'];
}