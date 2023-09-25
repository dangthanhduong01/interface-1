import {
  APPSFLYER_API_KEY,
  APPSFLYER_APP_ID,
  INFURA_PROJECT_ID,
  MOONPAY_API_KEY,
  MOONPAY_API_URL,
  MOONPAY_WIDGET_API_URL,
  ONESIGNAL_APP_ID,
  QUICKNODE_BNB_RPC_URL,
  SENTRY_DSN,
  UNISWAP_API_BASE_URL,
  UNISWAP_API_KEY,
  UNISWAP_APP_URL,
  WALLETCONNECT_PROJECT_ID,
} from 'react-native-dotenv'

export interface Config {
  appsflyerApiKey: string
  appsflyerAppId: string
  moonpayApiKey: string
  moonpayApiUrl: string
  moonpayWidgetApiUrl: string
  uniswapApiBaseUrl: string
  uniswapApiKey: string
  uniswapAppUrl: string
  infuraProjectId: string
  onesignalAppId: string
  sentryDsn: string
  walletConnectProjectId: string
  quicknodeBnbRpcUrl: string
}

const _config: Config = {
  appsflyerApiKey: process.env.APPSFLYER_API_KEY || APPSFLYER_API_KEY,
  appsflyerAppId: process.env.APPSFLYER_APP_ID || APPSFLYER_APP_ID,
  moonpayApiKey: process.env.MOONPAY_API_KEY || MOONPAY_API_KEY,
  moonpayApiUrl: process.env.MOONPAY_API_URL || MOONPAY_API_URL,
  moonpayWidgetApiUrl: process.env.MOONPAY_WIDGET_API_URL || MOONPAY_WIDGET_API_URL,
  uniswapApiBaseUrl: process.env.UNISWAP_API_BASE_URL || UNISWAP_API_BASE_URL,
  uniswapApiKey: process.env.UNISWAP_API_KEY || UNISWAP_API_KEY,
  uniswapAppUrl: process.env.UNISWAP_APP_URL || UNISWAP_APP_URL,
  infuraProjectId: process.env.INFURA_PROJECT_ID || INFURA_PROJECT_ID,
  onesignalAppId: process.env.ONESIGNAL_APP_ID || ONESIGNAL_APP_ID,
  sentryDsn: process.env.SENTRY_DSN || SENTRY_DSN,
  walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || WALLETCONNECT_PROJECT_ID,
  quicknodeBnbRpcUrl: process.env.QUICKNODE_BNB_RPC_URL || QUICKNODE_BNB_RPC_URL,
}

export const config = Object.freeze(_config)

if (process.env.NODE_ENV !== 'test' && __DEV__) {
  // Cannot use logger here, causes error from circular dep
  // eslint-disable-next-line no-console
  console.debug('Using app config:', config)
}
