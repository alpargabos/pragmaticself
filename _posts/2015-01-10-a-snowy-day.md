---
layout: post
title: "Interface Segregation Principle for Android"
subtitle: "SOLID principles part 4"
date: 2015-01-10
backgrounds:
    - https://dl.dropboxusercontent.com/u/18322837/cdn/Streetwill/on-the-road.jpeg
    - https://dl.dropboxusercontent.com/u/18322837/cdn/Streetwill/freezing.jpeg
    - https://dl.dropboxusercontent.com/u/18322837/cdn/Streetwill/village.jpeg
bg: get-unstuck.png
bgcolor: /#eede39
category: motivation
tags: motivation, life
ext-url: https://blog.pragmaticself.com/how-to-stop-depression-1fb99f5eed63#.qlpwy6kgn
---

<span class="big">W</span>elcome back to part 4 of the SOLID for Android Developers series. Today I’m going to cover the letter I in the SOLID pneumonic acronym - The Interface Segregation Principle (ISP).

If you missed the first three parts it’s easy to catch up:

-  S: Single Responsibility
-  O: Open/Closed Principle
-  L: Liskov Substitution Principle
-  I: Interface Segregation Principle (this article)
-  D: Coming soon.

And now back to part 4 in our series …

# The Interface Segregation Principle

The Interface Segregation Principle instructs us as developers to:

> Make fine grained interfaces that are client-specific.
> Make fine grained interfaces that are client-specific.
> Make fine grained interfaces that are client-specific.
> Make fine grained interfaces that are client-specific.
> Make fine grained interfaces that are client-specific.

Another way to put this is:

> Many client-specific interfaces are better than one general purpose interface.  
{: .large}

# Many-client specific interfaces?

When I first came across the definition of ISP I had a hard time grasping what it means – multiple interfaces?
What? Huh?

---
It’s actually pretty easy to understand. Let’s start with an example that we’re all very familiar with in Android - the Android View.  
As you know, the Android View class is the root superclass for all Android views. It is the root of TextView, Button, LinearLayout, CheckBox, Switch, etc. You name it, if it’s a button, the root superclass is View.
Let’s now assume that you are one of the developers who is writing the Android operating system way back in the dark ages of the mid to late 2000’s. You realize that most likely every view might need to be clicked on. Therefore, being a good Java citizen you create an interface called OnClickListener that is nested in the View class that looks like this:

term
  : definition

public interface OnClickListener {
    void onClick(View v);
}
I’m sure that looks vaguely familiar, right? :)

As time progresses you find out that you need a listener for long press events. Seeing that it’s something simple you decide to just throw it into the OnClickListener. It’s just a long press, right? No big deal… now your class looks like this:

public interface OnClickListener {
    void onClick(View v);
    void onLongClick(View v);
}
Some more time passes and you realize that you need to add some touch listeners to the view as well. The interface is still rather small so you decide to add another method to it. Can’t hurt anything, right?

Now your interface looks like this:

public interface OnClickListener {
    void onClick(View v);
    void onLongClick(View v);
    void onTouch(View v, MotionEvent event);
}
At this point, you decide to change the name of the interface from OnClickListener to ViewInteractions, or something similar. Why? Mainly because a touch event is different than a click event.

As you can tell, if you keep adding methods to this interface it is going to get unwieldy, and very quickly (it already is IMO).

This interface is becoming a problem – it’s becoming generic and polluted.

Why are generic polluted interfaces a problem?

Using the same OnClickListener from above, let’s imagine we’re developing an app using the Anroid SDK that we’ve built (remember, we’re pretending that we wrote the Android SDK…). I want to attach a click listener to a button, so I wire it up like this:

Button create = (Button)findViewById(R.id.create);
create.setOnClickListener(new View.OnClickListener {
    public void onClick(View v) {
       // assume this is a todo based app.
       myDatabase.createTask(...);
    }

    public void onLongClick(View v) {
        // do nothing, we're not long clicking
    }

    public void onTouch(View v, MotionEvent event) {
        // do nothing, we're not worried about touch
    }
});
Those last two methods, onLongClick and onTouch are not doing anything. Sure, we could put some code there, but what if I don’t need it? Most likely I’m only worried about a click, not the touch, not the long press. Sure, there are instances where you are concerned with those events in the same class, but most developers only need the click listener in this type of situation.

The interface is too generic because it’s requiring the client to implement all the methods, even if it doesn’t not need them. It’s trying to do too much. Let’s revisit the short definition of ISP:

Make fine grained interfaces that are client-specific.
By doing this, you eliminate the pollution in the client (the app that is using our interface, or in this case, Android apps) from unnecessary callbacks and code and that is not needed for the operation we’re implementing. The client should only have to implement interfaces that it needs and no more. In the example above, the client application did not need the onLongClick and onTouch.

Thankfully the fine folks over at Google are very familiar with the Interface Segregation Principle, and have done a great job following its advice. In the Android SDK we don’t have an overloaded OnClickListener, we have a very simple and specific listener - one that only implements onClick:

// nested in the View class
public interface OnClickListener {
    void onClick(View v);
}
If a developer wants to respond to a long press on a view, they can implement the OnLongClickListener. If they want to work with touch events they can implement the OnTouchListener.

Each interface is specific to what it’s job is.

ISP in the Real World

I work with a lot of different companies, and over the course of the last few years I’ve run into generic interfaces more often than I can remember. One such instance was for an SDK that I was helping develop. The clients of this SDK had to implement huge generic interfaces, even if they were only interested in one of the many methods this interface provided. What could have been 3-4 lines of code to implement now turned into 40-60 lines of code to implement the same thing, due to the unused methods.

Anytime you’re writing an interface and adding a method to it, ask yourself if you should be creating another interface in its place that is more specific to the client.

There are times when you might need your interface to have multiple methods, and that’s ok. For example, the Android TextView has the method addTextChangedListener. The TextWatcher interface supplies three methods:

public interface TextWatcher extends NoCopySpan {

    public void beforeTextChanged(CharSequence s, int start, int count, int after);

    public void onTextChanged(CharSequence s, int start, int before, int count);

    public void afterTextChanged(Editable s);
}
This is not a generic interface. These methods are all very specific to the interface and the client will most likely want to interact with them, therefore packaging them together in the same interface is the right thing to do.

Conclusion

The Interface Segregation Principle has the goal of helping decouple your application so that it’s easier to maintain, update and redeploy. Personally, I create interfaces for a ton of things in my application, especially if I’m using a dependency injection container (that’s a hint at our final installment in the SOLID series).

How does it make your app easier to deploy?

Imagine shipping a huge generic polluted interface only to later find out that you want to break it apart. That would be a huge breaking change for your client applications that depend on you. They rely on this interface to have a particular signature and now you have to change it.

Not only does this apply to the folks at who write SDKs, but it also applies to the code that you write in your own app. At some point, you need to create abstractions and those abstractions are the API that you now have to interface with. When you make these abstractions, make sure the interface is specific and not too generic. You’ll find that your code has less churn, is easier to maintain, and most of all, you’ll continue to enjoy working on your project.

Stay tuned for the final installment in the SOLID series next week!
