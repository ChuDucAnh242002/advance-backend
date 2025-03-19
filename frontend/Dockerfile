# frontend/Dockerfile

#Some implementation ideas provided below, but feel free to use your own.

FROM nginx:alpine

WORKDIR /var/www/localhost/html
COPY ./app/build /var/www/localhost/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]