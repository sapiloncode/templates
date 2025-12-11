import { BlockEmbed } from 'quill/blots/block'

export class ImageBlot extends BlockEmbed {
  static blotName = 'image'
  static tagName = 'img'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async loadBlobImageHandler(_match: string): Promise<string> {
    throw new Error('loadBlobImageHandler not implemented!')
  }

  static create(value: string) {
    const node = super.create() as HTMLImageElement
    node.setAttribute('data-src', value)

    const [match] = value.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i) || []
    if (match) {
      ImageBlot.loadBlobImageHandler(match)
        .then((src) => {
          node.setAttribute('src', src)
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return node
  }

  static value(node: Element) {
    return node.getAttribute('data-src')
  }
}
