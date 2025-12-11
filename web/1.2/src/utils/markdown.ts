import markdownit from 'markdown-it'
import markdownContainer from 'markdown-it-container'
import TurndownService from 'turndown'

function markdownFactory() {
  const md = markdownit({ html: true, linkify: true })

  md.use(markdownContainer, 'icon', {
    render: function (tokens: { nesting: number }[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return '<i class="material-symbols-outlined">'
      } else {
        return '</i>'
      }
    },
  })

  // Support File
  md.use(function (md) {
    const defaultRender =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, _, self) {
        return self.renderToken(tokens, idx, options)
      }

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const href = tokens[idx].attrGet('href')
      const content = tokens[idx + 1] && tokens[idx + 1].content

      // Check if it's a file Markdown link
      if (content && content.startsWith('file:')) {
        const filename = content.replace('file: ', '')
        return `<div class="quill-embed-file" data-uuid="${href}" data-filename="${filename}">`
      }

      // Otherwise, use the default renderer
      return defaultRender(tokens, idx, options, env, self)
    }

    md.renderer.rules.link_close = function (tokens, idx) {
      const prevToken = tokens[idx - 1] // The previous token should be the opening <a> tag
      const content = prevToken && prevToken.content

      // Close with </div> only if it was a file link
      if (content && content.startsWith('file:')) {
        return `</div>`
      }

      // Otherwise, use the default renderer for normal links
      return `</a>`
    }
  })

  md.renderer.rules.image = (tokens, idx, options, _env, self) => {
    const token = tokens[idx]

    // Get the 'src' attribute value
    const srcIndex = token.attrIndex('src')
    if (srcIndex >= 0) {
      // Replace 'src' with 'data-src'
      token.attrs[srcIndex][0] = 'data-src'
    }

    // Render the token using the overridden attribute
    return self.renderToken(tokens, idx, options)
  }

  md.inline.ruler.after('emphasis', 'single-strikethrough', function (state, silent) {
    const marker = state.src[state.pos]
    if (marker !== '~') return false

    const match = state.src.slice(state.pos).match(/^~(.*?)~/)
    if (!match) return false

    if (!silent) {
      const token = state.push('html_inline', '', 0)
      token.content = `<del>${match[1]}</del>`
    }

    state.pos += match[0].length
    return true
  })

  return md
}

function getTurndownService() {
  const service = new TurndownService()

  service
    .addRule('quillCodeBlocks', {
      filter: function (node) {
        return node.classList.contains('ql-code-block-container')
      },
      replacement: function (_, node) {
        let codeContent = ''
        node.querySelectorAll('.ql-code-block').forEach((codeBlock) => {
          codeContent += codeBlock.textContent + '\n'
        })
        return '\n```\n' + codeContent + '```\n'
      },
    })
    .addRule('imgDataSrc', {
      filter: function (node) {
        // Check if the node is an img tag with a data-src attribute
        return node.nodeName === 'IMG' && node.hasAttribute('data-src')
      },
      replacement: function (_, node) {
        // Get the value of the data-src attribute
        const dataSrc = (node as Element).getAttribute('data-src')

        // Return Markdown for the image using the data-src as the src
        return `![alt text](${dataSrc})`
      },
    })
    .addRule('singleStrikethrough', {
      filter: ['del'], // Use only <del> for strikethrough
      replacement: function (content) {
        return `~${content}~`
      },
    })
    .addRule('fileElement', {
      filter: function (node) {
        return node.nodeName === 'DIV' && node.classList.contains('quill-embed-file')
      },
      replacement(_content: never, node: HTMLElement) {
        const fileUrl = node.getAttribute('data-uuid')
        const filename = node.getAttribute('data-filename')
        return `[file: ${filename}](${fileUrl})`
      },
    })

  return service
}

export function markdown2Html(markdown: string) {
  const md = markdownFactory()
  const html = md.render((markdown ?? '').replace(/ {2}\n+/g, '<br>\n\n'))
  // console.log('HTML:', html)
  // console.log(markdown)
  return html
}

export function html2Markdown(html: string) {
  const turndownService = getTurndownService()
  const markdown = turndownService.turndown(html)
  return markdown
}
