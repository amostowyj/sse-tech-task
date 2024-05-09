FROM node:latest

WORKDIR /app

COPY . .

RUN npm install 

RUN npm run build

ENV DATABASE_URL="postgres://master:q9ex23noaxq3wdo8674@db1.company.com/prod"

EXPOSE 3000

CMD [ "npm", "run", "start" ]

