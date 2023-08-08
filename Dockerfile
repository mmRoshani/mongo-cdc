FROM node:18.17.0-alpine3.18 as builder

ENV NODE_ENV="production"

COPY . /app

WORKDIR /app

RUN npm install

# Second stage
FROM node:18.17.0-alpine3.18
ENV NODE_ENV="production"

COPY --from=builder /app /app

WORKDIR /app

CMD ["npm", "start"]