FROM oven/bun:1-alpine AS builder

# Copy in source files
RUN mkdir /app
WORKDIR /app
COPY . /app/

# Install dependencies and build project
RUN bun install
RUN bun run build

FROM scratch
COPY --from=builder /app/dist /
