import Configstore from 'configstore'
import pkg from '../../../package.json'

class ApiKeyManager {
  private static readonly apiKeyFieldName = 'apiKey'
  conf: Configstore

  constructor() {
    this.conf = new Configstore(pkg.name)
  }

  setKey(key: string) {
    this.conf.set(ApiKeyManager.apiKeyFieldName, key)
    return key
  }

  getkey() {
    const key = this.conf.get(ApiKeyManager.apiKeyFieldName)

    if (!key) {
      throw new Error('No API Key found - Get a key at https://nomics.com/')
    }

    return key
  }

  deleteKey() {
    const key = this.conf.get(ApiKeyManager.apiKeyFieldName)

    if (!key) {
      throw new Error('No API Key found - Get a key at https://nomics.com/')
    }

    this.conf.delete(ApiKeyManager.apiKeyFieldName)
  }
}

export { ApiKeyManager }
