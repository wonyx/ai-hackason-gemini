FROM node:22.9.0-slim AS base
WORKDIR /app

FROM base AS build
COPY . /app
RUN npm ci
RUN npm run build

FROM base AS image
ENV HOST=0.0.0.0
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
CMD [ "node", "dist/index.mjs" ]
