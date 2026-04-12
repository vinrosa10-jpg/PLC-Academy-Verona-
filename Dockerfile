FROM alpine:3.19

# Install PocketBase
ARG PB_VERSION=0.22.4
RUN apk add --no-cache wget unzip ca-certificates && \
    wget -q https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip && \
    unzip pocketbase_${PB_VERSION}_linux_amd64.zip -d /pb && \
    rm pocketbase_${PB_VERSION}_linux_amd64.zip && \
    chmod +x /pb/pocketbase

# Copy migrations and hooks
COPY pb_migrations /pb/pb_migrations
COPY pb_hooks /pb/pb_hooks

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
