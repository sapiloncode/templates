import React from 'react'

/**
 * Besides 'autoFocus' attribute make an Input or TextArea autoFocus
 * e.g. onFocus={moveEndOnFocus}
 */
export function moveEndOnFocus(ev: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>): void {
  const val = ev.target.value
  ev.target.value = ''
  ev.target.value = val
}

export function focusDivEnd(contentEditableElement: HTMLDivElement) {
  if (document.createRange) {
    const range = document.createRange() //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement) //Select the entire contents of the element with the range
    range.collapse(false) //collapse the range to the end point. false means collapse to end rather than the start
    const selection = window.getSelection() //get the selection object (allows you to change selection)
    if (selection) {
      selection.removeAllRanges() //remove any selections already made
      selection.addRange(range) //make the range you have just created the visible selection
    }
  }
}
