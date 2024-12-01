FROM node:22.7-slim
WORKDIR /todo-list-api
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
