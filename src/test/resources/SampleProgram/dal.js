/**
 * Populate initial contextual data
 */
ctx.populateContext(() => {
  ctx.insertEntity("id", "type", {})
  // more ctx.insertEntity...
})

/**
 * Register what will happen when event 'haha' will be selected.
 */
ctx.registerEffect('haha', function (data) {
  ctx.insertEntity('a' + data, 'b', {hahaData: data})
})

/**
 * Register queries
 */
ctx.registerQuery('B.All', entity => entity.type == 'b')
ctx.registerQuery('B.<5', entity => entity.type == 'b' && entity.hahaData < 5)
