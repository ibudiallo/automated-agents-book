# Do we need more AI?

The process I described can resolve the majority of issues, but there is always room for improvement. When we think of AI in the context of chatbots, it’s easy to imagine a single, all-encompassing model that handles everything from understanding the user’s intent to generating a response. But in reality, we can leverage multiple AI models, each with their own unique specialty. This approach can improve the user’s experience and can also give us a way to introduce new features.

For example, consider the original user input. Instead of sending it through a single AI model, we can have it go through multiple passes.

1. Classifier: The first pass involves a classifier to determine the type of action the user wants. It could be asking about an order, returning a product, or needing technical support.
2. Sentiment Analysis: The next pass could perform sentiment analysis to gauge the tone of the message. Understanding whether the customer is happy, frustrated, or neutral can influence how the chatbot responds. An angry customer likely doesn’t want any peppy talk. They just want their problem to be solved and be done with it.
3. Reason Classification: Another pass could classify the reason behind the customer’s original message. For example, if a customer wants to return an order, they may include a reason. Such as the product not meeting their expectations. Extracting this information upfront can be valuable for tailoring the response.

By using multiple AI passes, we can extract more nuanced information from user messages, making the chatbot not only more responsive but also more empathetic and contextually aware. This multi-layered approach ensures that the chatbot isn’t just reacting to what the customer is saying but is also considering how they are saying it and why they might be saying it. Each additional AI model we add becomes a new feature that can enhance the chatbot’s effectiveness in resolving customer issues.
