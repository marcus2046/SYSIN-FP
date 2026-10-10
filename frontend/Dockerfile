# syntax=docker/dockerfile:1

# ---- render: stamp the build number into the HTML ----
FROM alpine:3.20 AS render
ARG BUILD_NUMBER=dev
COPY index.html /index.html
RUN sed -i "s/__BUILD_NUMBER__/${BUILD_NUMBER}/g" /index.html

# ---- production: unprivileged nginx serving static files ----
FROM nginxinc/nginx-unprivileged:1.27-alpine AS production
COPY --from=render /index.html /usr/share/nginx/html/index.html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1