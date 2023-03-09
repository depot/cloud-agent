import {ServiceImpl} from '@bufbuild/connect'
import {TokenService} from '../../proto/depot/cloud/v2/token_connect'

export const impl: ServiceImpl<typeof TokenService> = {
  async getCacheRegistry(request, context) {
    return {image: 'hello-world', token: ''}
  },
}
