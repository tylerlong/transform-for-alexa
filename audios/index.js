export const transform = (event, context, callback) => {
  console.log(JSON.stringify(event, null, 2))
  callback(null, { statusCode: 200, body: event.body, headers: event.headers })
}
