FROM golang:alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o analytics-mock ./server.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/analytics-mock .

EXPOSE 8080

CMD ["/app/analytics-mock"]
