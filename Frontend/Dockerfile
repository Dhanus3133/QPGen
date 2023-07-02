FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json* yarn.lock* package-lock.json* ./
RUN yarn --frozen-lockfile

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY tailwind.config.js . 
COPY postcss.config.js .

ENV NEXT_TELEMETRY_DISABLED 1
