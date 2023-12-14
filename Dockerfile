from node:16-alpine

WORKDIR /usr/src/app

copy package.json .

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 9000

EXPOSE 3000

CMD ["npm", "start" ]