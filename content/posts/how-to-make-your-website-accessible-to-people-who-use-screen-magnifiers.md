---
title: "How to Make Your Website Accessible to People Who Use Screen Magnifiers"
date: 2017-06-07T17:10:06+02:00
draft: false
description: There's a lot of content out there on how to make your website accessible. But I haven't seen much on the subject of accessibility to users of screen magnifiers. I'm one of them, and I frequently run into annoying issues on the web.
---
There's a lot of content out there on how to make your website accessible. But I haven't seen much on the subject of accessibility to users of screen magnifiers. I'm one of them, and I frequently run into annoying issues on the web.

In this article, I'll give some tips on how you can make your website more accessible to users of screen magnifying software.

**Disclaimers:**

  - This article is purely based on years of using the web with a screen magnifier. I have conducted no user research (I'd love to see the results of such studies though).
  - I'm only going to discuss my experiences on the desktop, not mobile. While I do occasionally use the screen magnifier built into IOS, a mobile screen is so small that there's so little content on the screen when magnified to the desired level for me, that I usually prefer to use VoiceOver.
  - Whereas making websites more accessible to screen readers is **always a win** since it doesn't alter the visual appearance of the site, making it accessible to users of magnifiers might be a balancing act. I'm not a designer, and so I might be arguing for things in this article that would improve the experience for the people using magnifiers, but would be worse for the 99% of your visitors who are fully-sighted. In such cases, please leave a comment, I'd love to know about these.

# What's a screen magnifier

A screen magnifier is a piece of software that magnifies the screen (how unexpected!) It displays a portion of what would be on the screen, enlarged, either on the full screen, or on a region of the screen, leaving the rest unmagnified.

As an example, here's what it looks like for me to browse the articles on the home page of [dev.to](https://dev.to):

![](https://thepracticaldev.s3.amazonaws.com/i/oqoasmqwnnvep9ci2wri.gif)

# Moving the magnifier around the screen

Because the screen is being magnified, obviously not all of it will be visible on the display, so you move a sort of virtual rectangular magnifying glass around the screen as you move the mouse. On macOS, there are 3 options for how the movement of the magnifier relates to mouse movement, as illustrated in the following image.

![The illustration shows 3 rectangles representing computer screens. One represents the option to move the screen image "continuously with the pointer". In this mode, the screen moves as soon as the mouse moves. The position of the mouse on the magnified piece of the screen is proportional to the position of the mouse on the full-sized screen. In the "keep pointer centered" mode, the mouse stays centered as long as it is far away enough from the edge. When near the edge, the magnified image stops moving, so the pointer can move away from the center, towards the edge. In the "only move on edges" mode, the magnified portion of the screen doesn't move until the pointer hits one of the edges of the magnified area.](https://thepracticaldev.s3.amazonaws.com/i/ket4231nz0m9ma8kogyf.gif)

I'm sorry about the small font size in this gif. The three rectangles represent the full-size unmagnified screen. The moving dot represents the mouse cursor. The screen on the left shows the setting to move the magnified image continuously with the cursor. The one in the middle shows the setting for keeping the cursor near the center, while the one on the right shows the setting for only moving the magnifier when the pointer hits the edge of the magnified area.

# 1. Leave tooltips and other mouse-triggered pop-ups visible while the mouse is on the displayed content.

This is the biggest annoyance for me, so I'm putting it first. If you only act on one of these, make it this one. Here's an example from the AWS API Gateway Console:

![The image shows an animation of an information icon next to a checkbox. When the mouse is moved over the icon, a speech bubble appears next to the icon, with some explanatory text.](https://thepracticaldev.s3.amazonaws.com/i/jwk2eownwngdmirdqetd.gif)

As you can see the tooltip might not be completely visible when the cursor is hovering over the information icon. I'd need to move the mouse to get it in full view, but that hides the tooltip. So I can never completely read the tooltip at the magnification level I want.

The AWS Lambda console shows how this can be done better:

![In this image, the animation shows how the tooltip remains visible when the mouse cursor is moved from the information icon to the speech bubble, only disappearing when the cursor leaves the bubble.](https://thepracticaldev.s3.amazonaws.com/i/joqe6nq1e8l2h2bxup2u.gif)

This is much nicer. I can move my mouse over to the speech bubble in order to read it. Another option would be to toggle the tooltip on click, making it clear to the user that the icon is clickable by making it look more like a button, and changing the cursor into a hand when hovering over it.

# 2. Don't obscure content when the mouse is hovering over it.

The most annoying recent example I've seen of this is [Kickstarter's pledge levels](https://www.kickstarter.com/projects/theproperpeople/forbidden-explorers-urban-exploration-documentary).

![Image showing how when you hover over a support level in kickstarter to view the perks you get, the area is covered by a big green overlay.](https://thepracticaldev.s3.amazonaws.com/i/6ddjy32zofcusj54fy59.gif)

I understand that they wanted to make the whole area into a huge "call to action" button when the mouse cursor is on it, but the overlay makes the underlying list of perks hard to read. A high-contrast border might have been equally visually distinctive, or changing the background of the text, keeping the text visible with good contrast.

Another frequent example of this, is controls covering carousel/slider images or videos on hover. Here's [an example from TVL](https://www.tvl.be/programmas/weerbericht-weerbericht-6-juni-45243), a Belgian provincial television network. They clearly want to indicate that clicking the video will pause it. I think this is such a common interaction that such a big control isn't necessary, and even if it is, there are probably more usable ways of achieving it.

![Animation showing the pause button appearing right in the middle of the video, when the mouse enters the video player.](https://thepracticaldev.s3.amazonaws.com/i/xull41447azxij46ddrb.gif)

You can summarize this and the previous point as "don't rely on mouse position for content."

# 3 Put the result of an action close to the place where the action was triggered.

An example here is [Digital Ocean](https://m.do.co/c/6e1ff92c19c3). (You get $10 in DigitalOcean credit if you sign up through that link, and I get credit if you spend $25)

![](https://thepracticaldev.s3.amazonaws.com/i/kxtl6wi7npp37avabs8k.gif)

In this example, I edit my profile details in a modal in the center of the screen, but a confirmation appears in a [toast message](https://ux.stackexchange.com/questions/11998/what-is-a-toast-notification) on the top right.

In the case of the profile, you might also notice that the information displayed in the center has updated, but that's not quickly noticeable. The original place in their dashboard where I encountered this issue was when I first added funds to my account balance via paypal. A message had appeared in the top right, which I had missed, because I was looking in the center, part of the page, hwich contains the main content. My balance didn't immediately update, but I saw the transaction had gone through on Paypal, so for a couple of minutes, I thought there was a bug in DigitalOcean, where they took my money, but didn't give me credit.

I had a similar issue when using the search feature on [CodePen](https://codepen.io) after [their redesign](http://codepen.seesparkbox.com/). If you only see the right side of the screen, it's not immediately clear where you should go after clicking the search button.


![When you click the search button on the top right on codepen, a huge search bar appears on the left, but that's not visible when you're zoomed in on the right side..](https://thepracticaldev.s3.amazonaws.com/i/3uevd9z5zev9d8jkvzdq.gif)

Visually, I actually love how the search page looks. It just confused me a bit, the first time I used it

# That's it!

At least as far as I can see. But maybe my view is just too narrow 😊. Are you running into similar other issues in this genre? Do you have remarks on the points I've covered? Please let me know.

