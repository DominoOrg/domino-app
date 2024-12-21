FROM alpine:3.16
WORKDIR /app
COPY ./frontend .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]