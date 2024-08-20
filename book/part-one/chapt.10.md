# Using AI + Integration to resolve an issue

Although everyone wants to wrap chatgpt into their application today, a well trained classifier should be more than enough for your customer service needs. 

Customers can write for a variety of reasons, but those reasons are still limited. Tracking orders, returning items, declaring a missing item, canceling subscription, etc. As long as our AI model can classify customer messages into those buckets, we are set. And if our model can’t, all we need to do is collect enough of those messages and train a new model. Let’s work through an example.

## Case Study:

A customer purchased a dress in an online store and hasn’t received it yet. It’s been a few days now and she is starting to worry. She sees the transaction on her credit card, but no information was sent to her. She writes a message through email to complain that she hasn't received any information about the dress, and wants to know if it has already been shipped.

It’s possible that the confirmation message was sent but it was caught in her spam folder. Or the transactional email system was down during her purchase, or some other unforeseen event. But our goal is to make sure she has the most up to date information about her order.

We need to make use of our integrations before we can even receive the email. Let’s say this company uses Shopify to sell online, they use Zendesk to handle customer service, and they use both USPS and Fedex for shipment depending on the customer’s location.

1. When her email is sent, it is received by the help desk software Zendesk, and since we are integrated with zendesk, our application receives the message with all the metadata we need.
2. The application extracts the content of the email, cleans it up, and sends it to our AI for classification.
3. The AI will respond with the most likely classification of “Tracking Order”. Machine learning usually includes the confidence rate, we can choose a threshold we are comfortable with. For example, if it tells us it is 30% confident this is a Tracking Order, we may want to escalate this message to the next human agent. But let’s assume this one gives us 90% confidence, our application can start processing the Tracking Order script.
4. We can use the customer’s email address to find the most recent order. To do so, we use the integration with shopify to search for orders by email, and get the latest. We can look at the status of the order and check if there are any tracking numbers included.
5. If the tracking number is included, we can determine which carrier it belongs to, hopefully the eCommerce provides it, or we can deduce it by analyzing the format. USPS in this case.
6. We can then use our integration with USPS to get the latest tracking number status. We can use the tracking information returned to determine the type of response we will send to the customer.
7. Now that we have all this information, we can go through the company's policy, such as expected shipment time, take into account if there were any delays and craft the message. It’s tempting to use ChatGPT to generate a response, but it is just so unpredictable. A well crafted script can be just as effective and can remove surprises from the equation.
8. When we have our response, we can use the Zendesk integration to respond to the customer’s email.

From the customer’s perspective, she sent an email, and got a response a few seconds later. She is happy to know that her shipment is on the way. 

In this case the means of communication was email, but it could have been real time chat, or anything really. As long as there is an integration with the chat system, our chatbot just plays the role of a customer service agent and performs the exact same tasks in the background.
