/**
 * Escapes HTML special characters in a string.
 */
export function escapeHTML(string_: string) {
  return string_.replaceAll(
    /["&'<>]/g,
    (tag) => {
      return ({
        // eslint-disable-next-line ts/naming-convention
        '"': '&quot;',
        // eslint-disable-next-line ts/naming-convention
        '&': '&amp;',
        // eslint-disable-next-line ts/naming-convention
        '\'': '&#39;',
        // eslint-disable-next-line ts/naming-convention
        '<': '&lt;',
        // eslint-disable-next-line ts/naming-convention
        '>': '&gt;',
      }[tag]) as string
    },
  )
}
