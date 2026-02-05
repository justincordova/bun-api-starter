FROM oven/bun:latest

# TODO: Pin Bun version for production (e.g., FROM oven/bun:1.1.30)
# Using 'latest' for template flexibility, but pin specific version for reproducible production builds
WORKDIR /app

# Install curl for health checks
# Not pinning apt package versions for template flexibility, but pin for production reproducibility
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY package.json bun.lockb* ./

RUN bun install --frozen-lockfile --production --no-install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "index.ts"]
