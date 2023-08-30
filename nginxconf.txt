server {

  server_name cscloud7-150.lnu.se;
  index index.html;

  root /var/www/webhooks-server-setup;

  location / {
    try_files $uri $uri/ =404;
    proxy_pass http://localhost:5001/home/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /home/ {
    proxy_pass http://localhost:5001/home/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /issues/ {
    proxy_pass http://localhost:5001/issues/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /commits/ {
    proxy_pass http://localhost:5001/commits/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /tags/ {
    proxy_pass http://localhost:5001/tags/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /releases/ {
    proxy_pass http://localhost:5001/releases/;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
  }

  location /ws {
    proxy_pass http://localhost:8080;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }

  location /webhook {
    proxy_pass http://localhost:5001/webhook/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location /public/assets/style.css {
    proxy_pass http://localhost:5001/public/assets/style.css;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

   location /public/assets/gitlab-wallpaper-1.png {
    proxy_pass http://localhost:5001/public/assets/gitlab-wallpaper-1.png;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

    listen [::]:443 ssl ipv6only=on http2; # enable http2
    listen 443 ssl http2; # enable http2
    ssl_certificate /path/to/ssl/certificate.crt;  # Replace with actual path
    ssl_certificate_key /path/to/ssl/private_key.key;  # Replace with actual path
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
  if ($host = cscloud7-150.lnu.se) {
        return 301 https://$host$request_uri;
  } # managed by Certbot

  listen 80;
  listen [::]:80;

  server_name cscloud7-150.lnu.se;
  return 404; # managed by Certbot
}
