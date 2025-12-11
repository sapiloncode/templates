import { AppContext } from '@src/types'
import Handlebars from 'handlebars'

export function processUrlTemplate(cn: AppContext, url: string) {
  const template = Handlebars.compile(url)
  return template({ query: cn.query })
}
