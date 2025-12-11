import Embed from 'quill/blots/embed'

export class FileBlot extends Embed {
  static blotName = 'file'
  static tagName = 'div'
  static className = 'quill-embed-file'

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async downloadFileHandler(_uuid: string, _filename: string): Promise<void> {
    throw new Error('downloadFileHandler not implemented!')
  }

  static create(data: { filename: string; uuid: string }) {
    const node = super.create() as HTMLDivElement
    node.setAttribute('data-uuid', data.uuid)
    node.setAttribute('data-filename', data.filename)

    // Add icon and filename
    const icon = document.createElement('i')
    icon.className = 'material-symbols-outlined'
    icon.textContent = 'attach_file'

    const text = document.createElement('span')
    text.className = 'file-name'
    text.textContent = data.filename

    // Append to the blot node
    node.appendChild(icon)
    node.appendChild(text)

    // Add click event to download the file
    text.addEventListener('click', async () => {
      const uuid = node.getAttribute('data-uuid')
      const filename = node.getAttribute('data-filename')
      if (uuid && filename) {
        await FileBlot.downloadFileHandler(uuid, filename)
      }
    })

    return node
  }

  static formats(node: HTMLElement) {
    // Ensure custom formats are preserved in the DOM
    return {
      uuid: node.getAttribute('data-uuid'),
      filename: node.getAttribute('data-filename'),
    }
  }

  static value(node: HTMLElement) {
    return {
      filename: node.getAttribute('data-filename'),
      uuid: node.getAttribute('data-uuid'),
    }
  }
}
