---
title: "Lay Out Your Code Like You'd Lay Out Your House"
description: "Laying out your code base optimally can have a big impact on how easy it is to understand and maintain."
date: 2018-07-06T20:28:28+02:00
draft: false
image: "floorplan.jpg"
---

Imagine you wake up and get up to brush your teeth. You go to the "brooms and brushes" room to get your tooth brush. Then, you go to the "cleaning products" room to get toothpaste. You continue to the "containers" room to get a cup, and finally, you head into the "inputs and outputs" room, where you have a tap through which water enters your house, and a sink with a drain through which fluids can leave your house. You now have everything to go brush your teeth.

I won't bore you by describing the rest of your day in this very strange house in detail, but you can imagine getting a knife to spread some peanut butter on your bread from the "cutters" room, where you also keep your razors and garden shears. It'd obviously be incredibly inconvenient of your house were laid out that way. And yet, we often structure our code bases this way.

## Why Is This So Inconvenient?

In the example above, you had to visit 4 different rooms just to brush your teeth. This is ridiculous! You'd expect everything you need to brush your teeth to be conveniently located together.

So let's have a look at an example code base for a hypothetical blogging application. Since it's a hypothetical code base, I'm not using any specific web/database/... framework here.
The code will be written in Python, but you don't need to know Python to get the point of this post.

The structure of the app might look like this:

```
BogoBlog/
├── main.py
├── controllers/
│   ├── posts.py
│   ├── comments.py
│   └── users.py
├── errors/
│   ├── posts.py
│   ├── comments.py
│   └── users.py
├── storage/
│   ├── posts.py
│   ├── comments.py
│   └── users.py
├── templates/
│   ├── posts/
│   │   ├── post.html
│   │   └── ... more files ...
│   ├── comments/ ...more files inside ...
│   └── users/ ...more files inside ...
└── validators/
    ├── posts.py
    ├── comments.py
    └── users.py
```

This looks like an **MVC** application. Let's take a look at the `controllers/posts.py` file:

````python
from cool_web_framework import BaseController, HttpForbiddenError, HttpNotFoundError,
from storage.posts import PostsStore
from storage.users import UsersStore
from errors.posts import PostNotFoundError
from errors.users import UserNotFoundError
from validators.posts import validate_post

class PostController(BaseController):
    def get(self, postId):
        """Handle GET requests to /posts/{postId}"""
            post = self.fetch_post(postId)
        
        if post.is_draft:
            self.ensure_current_user_can_edit(post)
        
        return self.render_template("templates/post.html", post)
    
    def post(self, postId):
        """Handle POST requests to /posts/{postId}"""
        post = self.fetch_post(postId)
        
        self.ensure_current_user_can_edit(post)
        
        data = self.request.body.json()
        err = validate_post(data)
        if err:
            raise HttpBadRequestError(err)
        
        post.update(data)
        PostsStore.save(post)
        return self.redirect("/")
    
    def fetch_post(self, postId):
        try: 
            return PostsStore.get_post_by_id(postId)
        except PostNotFoundError:
            raise HttpNotFoundError("No post with id " + postId)
    
    def ensure_current_user_can_edit(self):
        err = HttpForbiddenError("You don't have permission to view this post.")
        try:
            return UsersStore.get_current_user(self.request)
        except UserNotFoundError:
            raise err
        
        if not (user.is_admin or post.author == user):
            raise err

````

This code might look reasonable, but now imagine you are asked to add a "banner_image" field to posts to make them more visually interesting. This required changes in:

  - `storage/posts.py` to add the field to the database.
  - `controllers/posts.py` to handle the uploaded image.
  - `validators/posts.py` to validate the image, make sure it's of a supported file type, size, etc.
  - `templates/posts/post.html` to display the image.
  
While this isn't too bad in a code base of this size, as your code base grows, it becomes harder to track down where things need to be changed. Having to jump around this much also makes the code base harder to understan. The reason we're editing files all over the place to add a feature is because we've grouped files by what type of code they hold in terms of te **MVC** pattern, rather than grouping them by **what functionality they provide**.

## Let's Fix This!

![](refactor.png)

Let's group all posts-related functionality together, all users-related functionality together, etc...

```
BogoBlog/
├── main.py
├── posts/
│   ├── controllers.py
│   ├── storage.py
│   ├── validators.py
│   └── templates/
│       ├── post.html
│       └── ... more files ...
├── comments/
│   ├── controllers.py
│   ├── storage.py
│   └── validators.py
└── users/
    ├── controllers.py
    ├── storage.py
    └── validators.py
```

So now, when we need to change something related to posts, you'll likely just have to edit files in `/posts`, and the same goes for other pieces of functionality. Of course, you may still need to edit code in multiple directories, but at least now you're thinking in terms of which **features** of the app a change affects.

## Other Considerations.

  - **It's not just MVC**. I've used an MVC app here, because it's a pattern a lot of people are familiar with, but the same problem occurs in other cases, like when you split a React+Redux app into components, actions, reducers, ... etc.
  - **Conventions are important**. You can be much more productive if everyone understands the structure of the code base. If there's a code base structure that the community, your company or your team sticks to, don't just suddenly change everything. If you'd like to change the conventions, start a conversation around it. Changing a convention might also require tooling changes, like CLI tools that scaffold the project structure.
  - **Build frameworks that support this**. If you're the author of a framework, try to design it soo users can structure their code base this way. Django does this quite nicely by splitting projects into "apps" that hold different features for the project. (yes the name app is a bit confusing there, since you'd consider the entire project an app, but you get used to that.)
  - **Don't nest too deeply**. Directories make it easier to find things, but they have the disadvantage that you need to remember where files are. Most places that display a list of files can do so in alphabetical order based on the file name. And it's quite easy to find a file in a sorted list, whereas it requires much more mental cycles to remember a deeply nested structure of files and folders.

## Thanks for reading!

Please let me know what you think [on Twitter](https://twitter.com/_bigblind)