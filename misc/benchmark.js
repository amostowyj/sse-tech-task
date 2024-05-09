const autocannon = require("autocannon");

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const url = "http://localhost:3000/message/user";

const options = {
  url,
  method: "GET",
  connections: 5,
  duration: 60,
  headers: {
    authorization: `Basic YWRtaW46Y2hhbmdlbWU`,
  },
  requests: [
    {
      setupRequest: function (request) {
        (request.path = `${request.path}/${getRandomInt(1, 500)}`),
          console.log(request.path);
        return request;
      },
    },
  ],
};

autocannon(options, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result);
  }
});
