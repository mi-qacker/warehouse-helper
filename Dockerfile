FROM node:23.11.0-slim AS builder
WORKDIR /app
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23.11.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]