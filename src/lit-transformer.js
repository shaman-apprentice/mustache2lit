/** 
 * @param {object} config = {
 *  html: lit-html.html,
 *  delimiter: { start: '{{', end: '}}' },
 *  transformers: { // note that transformVariable is not here, so that it is always the last one
 *    name: {
 *      test: (str, config) => bool,
 *      transform: (str, config) => ({
 *        remainingTmplStr: str,
 *        staticParts: [ str ],
 *        insertionPoint: (ctx) => lit-html.TemplateResult,
 *      }),
 *    },
 *  },
 *  transformVariable, 
 * }
 * @returns {function} strTemplate => ctx => lit-html.TemplateResult
 */
export default config => template => transform(template, config)

export function transform(tmpl2Parse, config) {
  const staticParts = []
  const insertionPoints = []

  let remainingTmplStr = tmpl2Parse
  let startIndexOfIP
  while (0 <= (startIndexOfIP = remainingTmplStr.indexOf(config.delimiter.start))) {
    staticParts.push(remainingTmplStr.substring(0, startIndexOfIP))
    remainingTmplStr = remainingTmplStr.substring(startIndexOfIP + config.delimiter.start.length)

    const transform = getTransform(remainingTmplStr, config)
    const transformResult = transform(remainingTmplStr, config)
    remainingTmplStr = transformResult.remainingTmplStr
    insertionPoints.push(transformResult.insertionPoint)
  }

  staticParts.push(remainingTmplStr)

  return ctx =>
    config.html(staticParts, ...insertionPoints.map(iP => iP(ctx)))
}


function getTransform(remainingTmplStr, config) {
  const transformer = Object.values(config.transformers).find(t => t.test(remainingTmplStr, config))
  return transformer
    ? transformer.transform
    : config.transformVariable
}