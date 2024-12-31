FROM node:22.7-slim
WORKDIR /todo-list-api
RUN chown -R node:node ./
USER node
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node ./ ./
EXPOSE 3000
