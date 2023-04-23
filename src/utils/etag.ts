import {hasher as nodeObjectHash} from 'node-object-hash'

const hasher = nodeObjectHash({coerce: false, enc: 'base64'})

export function calculateEtag(obj: object) {
  return hasher.hash(obj)
}
