# Build stage
FROM node:22-alpine AS build

# Define build arguments
ARG NEXT_PUBLIC_API_URL
ARG NODE_ENV=production

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY . .
RUN npm ci --include=dev
RUN npm run build

# Runtime stage
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
