FROM nginx:alpine

COPY exn0l.html /usr/share/nginx/html/index.html
COPY exn0l.js /usr/share/nginx/html/exn0l.js
COPY exn0l-style.css /usr/share/nginx/html/exn0l-style.css

EXPOSE 80