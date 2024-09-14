"The Expanse" is one of my favorite sci-fi shows. Set hundreds of years into the future, humanity has colonized the solar system, and space travel has become routine thanks to the fictional Epstein Drive. Technology is at its peak, yet one noticeable absence is a friendly, conversational robot.

I remember coming across a Reddit forum where people discussed the lack of AI in the series. This surprised me because I saw AI present in almost every scene. Not in the form of the familiar C-3PO, but rather as a tool. When characters encounter a problem requiring computation, they simply ask aloud, and the AI provides the solution, efficiently, without unnecessary conversation or personality. Yet, we often fail to recognize it as AI unless it speaks or exhibits a human-like demeanor.

To me, the true power of AI, or any computer, lies in its ability to solve problems. We may not be building space travel technology after reading this book, but at the very least, we can develop AI that functions similarly to those in The Expanse: When you have a question, you ask it, and it finds the solution.

When we talk about chatbots today, it's easy to assume that a sophisticated system like ChatGPT might be behind your website's modest chatbot. But that’s often overkill. Sure, it might be able to answer your user's questions, but it’s like attaching a jet engine to a tricycle. Unnecessary and impractical. Most users don’t visit your website’s chatbot to get general information. For that, they can easily go to Google or ChatGPT itself.

Chatbots have existed for decades, but Siri was a game changer, especially in shaping the public’s perception of AI. Here was an AI that lived in your phone and could answer almost any question you had. For an Apple product, however, Siri often failed, frequently redirecting users to a Google search. But for the first time, the public saw software that could listen, understand, and respond. I’d like to focus on Siri a bit because its inner workings are quite similar to the chatbots we’ll be discussing in this book.

Although you can ask Siri general questions, it shines when answering practical ones: “Can you call Mom?” “What’s the weather like?” “Who invented the airplane?” These queries are easily classified and redirected to an application with an integrated API that provides an answer. When you asked Siri to “Call Mom,” Siri didn’t just automatically know who “Mom” was. It converted your speech to text, sent it to a classifier to determine the intent, "making a call." Then passed it to an entity recognition engine that identified “Mom” as the contact. In the background, it would execute a function. If you saved your mother's phone number under "Mom," it would call her. Otherwise, it would fail, and Siri would say, "I can't find Mom."

```js
const nextAction = MakePhoneCall({ contactName: "Mom" });
if (nextAction) {
	return nextAction();
} else {
	return siriSay("I can't find", { contactName: "Mom" });
}
```

This integration with the Phone app allowed Siri to make calls, and similar integrations with the Weather app, a knowledge base, and search engines gave Siri a wide range of capabilities. Each new integration made Siri seem smarter. But what made Siri appear particularly intelligent to the public was its voice. The simple fact that Siri had a pleasant, human-like voice gave it a persona, making it feel intelligent and almost human.

While this book will only briefly explore voice capabilities, our focus is on building something practical—something that solves problems effectively rather than trying to mimic human behavior.

<div class="block-ref">

TARS is a highly advanced AI robot in the movie *Interstellar*. He could communicate in a very human-like manner, even making jokes. 

<div class="chat-window" data-title="TARS and Cooper - Interstellar">

<div class="bubble left" data-info="TARS">

I have a cue light I can use to show you when I'm joking if you like.

</div>

<div class="bubble right" data-info="Cooper">

That’d probably help.

</div>

<div class="bubble left" data-info="TARS">

Yeah, you can use it to find your way back to the ship after I blow you out the airlock.

</div>

<div class="bubble right" data-info="Cooper">

What’s your humor setting, TARS?

</div>

<div class="bubble left" data-info="TARS">

That’s 100 percent.

</div>

<div class="bubble right" data-info="Cooper">

Let’s bring it on down to 75, please.

</div>

</div>

The humor and personality that TARS displays are entertaining and give the robot a human-like quality. However, these features are secondary to its primary function: solving problems and assisting the crew on a mission. Similarly, while a chatbot might have a friendly persona or even crack a joke, its main purpose should always be to efficiently resolve customer issues. Just like TARS, our chatbot should be effective first and personable second.

</div>