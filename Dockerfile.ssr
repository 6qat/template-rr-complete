# Development dependencies (source and node_modules)
FROM node:22-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm install -g pnpm && pnpm install

# Only production node_modules
FROM node:22-alpine AS production-dependencies-env
COPY ./package.json pnpm-lock.yaml /app/
WORKDIR /app
RUN npm install -g pnpm && pnpm install --prod

# Generates build directory
FROM node:22-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm install -g pnpm && pnpm run build

# Runtime (no source code and no development dependencies)
FROM node:22-alpine
COPY ./package.json pnpm-lock.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
RUN npm install -g pnpm
CMD ["pnpm", "start"]