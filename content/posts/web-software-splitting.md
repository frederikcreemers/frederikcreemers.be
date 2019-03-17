---
title: Is The Web Forcing Us to Split Applications the Wrong Way?
date: 2019-01-30T15:42:36+01:00
description: Could the way we architect web applications be making them harder to modify?
cover_image: https://thepracticaldev.s3.amazonaws.com/i/8it1bawekbzfvy6uvj8l.jpg
draft: false
---

In November of last year, I attended a meetup in Utrecht for the [global day of coderetreat](https://www.coderetreat.org/). During the lunch break, there was a talk by [Joost Baas](https://www.linkedin.com/in/joost-baas-667b3814/?originalSubdomain=nl) from [bol.com](https://bol.com), a large Dutch eCommerce company.

![ ](https://thepracticaldev.s3.amazonaws.com/i/vz91sltukl1lczrhoib9.jpg)

In the talk, Joost discussed a change they were making to how order statuses work. They integrated with the delivery firms to provide the shipping status within the bol.com interface. They added some new possible states an order could be in. This change rippled through different teams; from the backend where the new state was introduced (possibly even multiple microservices within the backend), to the web and mobile frontend which had to handle the new state to display it in a user-friendly way. Each of these had to add a new check for these values.

They started to wonder if they could avoid rippling effects from changes like this in the future. So what they ended up doing was making the API provide the status label, description and any other info that the frontend would need to display. The UI would then provide places where these values would be displayed.

# Coherence and Decoupling

The talk reminded me about a [blog post on code layout](https://www.frederikcreemers.be/posts/code-layout/) I wrote earlier last year. The post argues for grouping code by application domain (users, blog posts, permissions, ...), rather than architectural component (models, views, controllers, repositories, ...). Code dealing with a certain part of the problem domain is often necessarily coupled together. There are lots of definitions for coherence out there, but I think of application parts being coherent if they have an inherent reason to change together. So grouping coherent code together often confines changes to a specific part of the code base.

# The Chasm Between the Client and the Server

In applications with a client-server architecture (of which web applications are probably the most common), by definition, the code runs in 2 separate areas, the client and the server. 

But wait..., client and server are **architectural** components, with components belonging to the same domain area, split between the 2 sections of code. Worse yet, these are often completely separate repositories, written in different programming languages, managed by different teams! This leads to a situation where cascading changes are quite common, but hard to coordinate.

# Solutions?

This is not one of those blog posts where I have a magical solution in the conclusion. I have a few guesses for what might work, and **I'd love to hear from you** about your experiences.

If all the parts of your application are written in the same language, you can share a lot of data structures and logic between the client and server, isolating the code that is tailored to a specific platform.

Have you tried splitting your code by domain area rather than client/server? (How) did that work?




