FROM node:lts
WORKDIR /app
COPY . /app
RUN npm install -g @nestjs/cli
RUN npm install
EXPOSE 3666


