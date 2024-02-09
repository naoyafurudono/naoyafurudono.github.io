FROM golang:1.22.0-alpine3.19 as builder

WORKDIR /app
COPY . /app/
RUN go build -o app

FROM alpine:3.19

WORKDIR /app
COPY --from=builder /app/app /app/app
CMD ["/app/app"]
