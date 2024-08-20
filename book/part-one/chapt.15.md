# Keeping the AI Models up to date

AI models are only as good as the data they are trained on, and in the diverse world of eCommerce, customer communication varies significantly across different platforms and product types. For example, customers buying digital goods often use jargon that is unique to the tech-savvy community, while those purchasing physical arts and craft may use language that is more descriptive and emotive.

This variation in language can become a challenge for AI models, especially when they are trained primarily on data from one type of customer. An AI model optimized for handling inquiries about software downloads might struggle to accurately classify and respond to questions about handcrafted jewelry.

This is why it is important to have a robust training pipeline in place to allow regular updates of the AI models. This pipeline should focus on three areas in order of priority:

1. **Handling False Positives:**
	* False positives occur when the AI misclassifies a customer inquiry, leading to an incorrect or irrelevant response. By having a path in place to identify and report these errors, the model can be improved immediately.
2. Addressing Low Confidence Scores:
	* When the AI encounters a message it is unsure about, it gives it a low score. These low score interactions are a goldmine for improving the model.
3. **Random Sample of new messages:**
	* When starting integration with a new company, it is important to grab a random sample of the messages they receive and train the models with it. This ensures that false positives are less likely to occur.

Regularly updating the AI models through this pipeline not only improves their ability to classify and respond to a wider range of customer inquiries but also ensures that the chatbot remains relevant as customer communication styles evolve. Continuous training allows the chatbot to adapt to new trends, slang, and industry-specific language, ultimately expanding the number of customers it can assist effectively.

Training the model means having humans look at customer messages and decide what they actually mean. This means exposing customer personal information. To properly perform training, we need to take security and data privacy into account.

![](/training-pipepline.svg)