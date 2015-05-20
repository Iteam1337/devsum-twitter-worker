FROM node
ADD package.json /app/
WORKDIR /app
RUN npm install
ADD ./lib /app/lib
ADD ./index.js /app/index.js
ENV PORT=3000
EXPOSE 3000
CMD node index.js
