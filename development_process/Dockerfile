FROM golang:1.5
RUN mkdir -p /go/src/app
WORKDIR /go/src/app
COPY . /go/src/app
RUN go get github.com/codegangsta/gin
RUN go-wrapper download
RUN go-wrapper install
ENV PORT 8080
EXPOSE 3000
CMD gin -p 3000 -a 8080 run
