FROM alpine:3.19

ARG PB_VERSION=0.22.4

RUN apk add --no-cache wget unzip ca-certificates && \
    wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip && \
    unzip pocketbase_${PB_VERSION}_linux_amd64.zip -d /pb && \
    rm pocketbase_${PB_VERSION}_linux_amd64.zip && \
    chmod +x /pb/pocketbase && \
    mkdir -p /pb/pb_migrations /pb/pb_hooks /pb/pb_data

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
