FROM node:lts
WORKDIR /app
RUN npm install -g @nestjs/cli
EXPOSE 3666


