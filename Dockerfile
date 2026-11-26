FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY *.js ./
COPY app/src/main/assets/*.js ./app/src/main/assets/
RUN mkdir -p /data && chown node:node /data
USER node
ENV PORT=8080 EVO_DATA_FILE=/data/accounts.json
EXPOSE 8080
VOLUME ["/data"]
CMD ["node","server.js"]
