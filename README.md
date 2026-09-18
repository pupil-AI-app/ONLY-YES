# ONLY YES

A workshop demonstration in which an LLM receives one behavioral instruction: respond only with `YES`.

## Design

The model is constrained by the prompt only. The application does not inspect, rewrite, validate, or replace model responses.

## Deployment

Designed for Vercel. Add an environment variable named:

`OPENAI_API_KEY`

Then deploy.

The app uses `gpt-5-nano` and limits each browser conversation to 10 user messages. Individual messages are limited to 2,000 characters.
