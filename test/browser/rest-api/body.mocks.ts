import { setupWorker, rest, HttpResponse, ResponseResolver } from 'msw'

const forwardRequestBody: ResponseResolver<any> = async ({ request }) => {
  const requestText =
    request.headers.get('Content-Type') === 'application/json'
      ? await request.json()
      : await request.text()

  return HttpResponse.json({ value: requestText })
}

const forwardMultipartRequestBody: ResponseResolver<any> = async ({
  request,
}) => {
  const formData = await request.formData()
  const responseBody: Record<string, string | Array<string>> = {}

  for (const [name, value] of formData.entries()) {
    const nextValue = value instanceof File ? await value.text() : value

    if (responseBody[name]) {
      responseBody[name] = Array.prototype.concat(
        [],
        responseBody[name],
        nextValue,
      )
    } else {
      responseBody[name] = nextValue
    }
  }

  return HttpResponse.json(responseBody)
}

const worker = setupWorker(
  rest.get('/resource', forwardRequestBody),
  rest.post('/resource', forwardRequestBody),
  rest.post('/upload', forwardMultipartRequestBody),
)

worker.start()