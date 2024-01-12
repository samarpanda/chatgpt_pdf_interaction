# ChatGPT PDF Interaction

This project leverages the ChatGPT openai embedding to convert a pdf file into vector datastore that is saved in-memory. It utilizes the LangChain js library for natural language processing.

## Usage

1. Rename `.env.example` to `.env`
1. Add a valid openai api key to `OPENAI_API_KEY`
1. Add a pdf file with the name `queries.pdf`

```
npm install
node faq.js "Add your question here?"
```
