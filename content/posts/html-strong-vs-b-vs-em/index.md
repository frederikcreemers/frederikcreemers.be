---
title: "Attention! <strong> VS. <b> vs <em>, and when to use them."
date: 2024-04-22T22:27:16+02:00
draft: false
---

The HTML elements `<strong>`, `<b>`, and `<em>` seem to serve a very similar function: to emphasize, or draw attention to, a particular part of the content.

I didn't like any of the top search results when googling this, because all I wanted was a quick summary of what the spec has to say on this. So, I made one.


## The `pre` element

From [The relevant section in the HTML spec](https://html.spec.whatwg.org/#the-em-element)

> The em element represents stress emphasis of its contents.
>
> The level of stress that a particular piece of content has is given by its number of ancestor em elements.
> 
> The placement of stress emphasis changes the meaning of the sentence. The element thus forms an integral part of the content. The precise way in which stress is used in this way depends on the language.

To illustrate this use, they repeat the same statement about cats, with em tags around various parts of the sentence:

> `<p><em>Cats</em> are cute animals.</p>`
> 
> Moving the stress to the verb, one highlights that the truth of the entire sentence is in question (maybe someone is saying cats are not cute):
> 
> `<p>Cats <em>are</em> cute animals.</p>`
>
> By moving it to the adjective, the exact nature of the cats is reasserted (maybe someone suggested cats were mean animals):

[...]

> Anger mixed with emphasizing the cuteness could lead to markup such as:
> 
> `<p><em>Cats are <em>cute</em> animals!</em></p>`

## The `strong` element

[According to the spec](https://html.spec.whatwg.org/#the-em-element):

> The strong element represents strong importance, seriousness, or urgency for its contents.

The spec has some examples for each of these cases

> Here, the word "chapter" and the actual chapter number are mere boilerplate, and the actual name of the chapter is marked up with strong:
> 
> `<h1>Chapter 1: <strong>The Praxis</strong></h1>`

> Here is an example of a warning notice in a game, with the various parts marked up according to how important they are:
> 
> ```<p><strong>Warning.</strong> This dungeon is dangerous.
> <strong>Avoid the ducks.</strong> Take any gold you find.
> <strong><strong>Do not take any of the diamonds</strong>,
> they are explosive and <strong>will destroy anything within
> ten meters.</strong></strong> You have been warned.</p>```

> n this example, the strong element is used to denote the part of the text that the user is intended to read first.
> 
> ```<p>Welcome to Remy, the reminder system.</p>
> <p>Your tasks for today:</p>
> <ul>
>  <li><p><strong>Turn off the oven.</strong></p></li>
>  <li><p>Put out the trash.</p></li>
>  <li><p>Do the laundry.</p></li>
> </ul>

## The `b` element


