import Inline from 'quill/blots/inline'

export class StrikeBlot extends Inline {
  static blotName = 'strike'
  static tagName = 'del' // Use <del> instead of <s>
}
