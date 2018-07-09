---
title: "Protecting a Directory on Your Caddy Server With Google Login"
date: 2018-04-26T19:45:43+02:00
draft: true
---

[Caddy](https://caddyserver.com/) is an amazing web server. I mostly use it for serving static files, but you can also use it as a reverse proxy. One of its big features is that it automatically gets an SSL certificate using [LetsEncrypt](https://letsencrypt.org/). So the connection between the server and the user is encrypted, but what if you want to protect a portion of the content served by your server? What if you want to only grant certain people access to that content?

Caddy has a [HTTP Basic Authentication directive](https://caddyserver.com/docs/basicauth)hu
