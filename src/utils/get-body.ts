export function getBody(request): Promise<unknown> {
    return new Promise((resolve) => {
      const bodyParts = [];
      let body;
      request.on('data', (chunk) => {
        bodyParts.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(bodyParts);
        resolve(JSON.parse(body))
      });
    });
  }