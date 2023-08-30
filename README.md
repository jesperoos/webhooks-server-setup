webhooks-server-setup  
<br>
***Installation***  
This is meant to run on a remote server. I have used nginx as a reverse proxy, which means you will need to configure that to serve and redirect to the proper places on the server. Assuming you have an installed version of ubuntu and installed node: Clone the repo into your folder of choice on the server. Navigate into it and run npm install.  
<br>
Nginx will need to be installed and a configuration file has to be created and edited with the redirections of the paths of the different elements. Mine was located in "/etc/nginx/conf.d/domain-name.conf". The contents of the .conf file is located in nginxconf.txt. You may need to change the line "root /var/www/webhooks-server-setup;" to where your root should be located. And also the lines containing "cscloud7-150.lnu.se;" to what your domain is in both the nginx conf, and the .ejs files.  
<br>
Enabling Transport Layer Security (TLS):  
Obtain SSL/TLS certificates for your domain using a service like Let's Encrypt.  
Replace the paths in the lines "ssl_certificate" and "ssl_certificate_key" in the nginx conf file with the actual paths.  
<br>
You will also need to setup your webhook and access token in gitlab.  

I am also using DotEnv to hide my tokens and secrets. You will need to reconfigure this into your own tokens. And also change the projectId variable in express.mjs to the id of your project. Install pm2 and use this command to run the express.mjs app "PORT=5001 pm2 start npm --name someID:5001 -- start".  
<br>
Now it should be working!

***NOTE***  
As of right now, the only implemented real-time update is issues.
