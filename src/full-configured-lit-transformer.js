import createTransform from './lit-transformer'
import createVariableTransformer from './transformers/variable'
import unsafeVariableTransformer from './transformers/unsafeVariable'
import sectionTransformer from './transformers/section'
import invertedSectionTransformer from './transformers/invertedSection'
import commentTransformer from './transformers/comment'

export default (html, unsafeHTML) =>
  createTransform({
    html,
    transformers: [
      createVariableTransformer(),
      unsafeVariableTransformer(unsafeHTML),
      sectionTransformer(),
      invertedSectionTransformer(),
      commentTransformer(),
    ],
  })