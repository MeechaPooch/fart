/**
 * Finds all <p> elements where the text has wrapped to 2 or more lines.
 */
function getWrappedParagraphs() {
  const paragraphs = document.querySelectorAll('.document p');
  const wrappedElements = [];

  paragraphs.forEach((p) => {
    // Get the total height of the element and the height of a single line
    const style = window.getComputedStyle(p);
    const height = p.offsetHeight;
    
    // Parse line-height. If 'normal', we estimate based on font-size.
    let lineHeight = parseFloat(style.lineHeight);
    if (isNaN(lineHeight)) {
      lineHeight = parseFloat(style.fontSize) * 1.2; // Standard browser default ratio
    }
    console.log(style)
    console.log(style.padding)

    // If height is significantly greater than line-height, it has wrapped
    if (height > lineHeight + (Number.parseInt(style.paddingBlock)*2)+2) { // +2px buffer for sub-pixel rendering
      wrappedElements.push(p);
    }
  });

  return wrappedElements;
}

// Execution
const wrappedPs = getWrappedParagraphs();
console.log('Wrapped Paragraphs:', wrappedPs);
wrappedPs.forEach(e=>e.classList.add('wrapp'))