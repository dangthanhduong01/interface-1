import { isValidWCUrl } from 'src/features/walletConnect/WalletConnect'
import { getValidAddress } from 'src/utils/addresses'

export enum URIType {
  WalletConnectURL = 'walletconnect',
  Address = 'address',
  EasterEgg = 'easter-egg',
}

export type URIFormat = {
  type: URIType
  value: string
}

const EASTER_EGG_QR_CODE = 'DO_NOT_SCAN_OR_ELSE_YOU_WILL_GO_TO_MOBILE_TEAM_JAIL'
const CUSTOM_UNI_QR_CODE_PREFIX = 'hello_uniwallet:'

export async function getSupportedURI(uri: string): Promise<URIFormat | undefined> {
  if (!uri) {
    return undefined
  }

  const maybeAddress = getValidAddress(uri, true)
  if (maybeAddress) {
    return { type: URIType.Address, value: maybeAddress }
  }

  const maybeMetamaskAddress = getMetamaskAddress(uri)
  if (maybeMetamaskAddress) {
    return { type: URIType.Address, value: maybeMetamaskAddress }
  }

  if (await isValidWCUrl(uri)) {
    return { type: URIType.WalletConnectURL, value: uri }
  }

  const maybeCustomWcUri = await getCustomUniswapWcCode(uri)
  if (maybeCustomWcUri) {
    return { type: URIType.WalletConnectURL, value: maybeCustomWcUri }
  }

  if (uri === EASTER_EGG_QR_CODE) {
    return { type: URIType.EasterEgg, value: uri }
  }
}

async function getCustomUniswapWcCode(uri: string) {
  if (uri.indexOf(CUSTOM_UNI_QR_CODE_PREFIX) !== 0) {
    return null
  }

  const maybeWcUri = uri.slice(CUSTOM_UNI_QR_CODE_PREFIX.length)
  if (await isValidWCUrl(maybeWcUri)) {
    return maybeWcUri
  }

  return null
}

// metamask QR code values have the format "ethereum:<address>"
function getMetamaskAddress(uri: string) {
  const uriParts = uri.split(':')
  if (uriParts.length < 2) {
    return null
  }

  return getValidAddress(uriParts[1], true)
}
