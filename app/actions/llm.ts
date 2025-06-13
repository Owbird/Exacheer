'use server';

import { StartChatParams } from '@google/generative-ai';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  MessageContent,
  SystemMessage,
} from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  apiKey: process.env.GEMINI_API_KEY!,
});

function convertToMessages(
  prompt: string,
  history: StartChatParams['history'],
  systemInstruction: string
): BaseMessage[] {
  return [
    new SystemMessage(systemInstruction),
    ...(history ?? []).map((msg) =>
      msg.role === 'user'
        ? new HumanMessage(msg.parts.map(({ text }) => text).join(' '))
        : new AIMessage(msg.parts.map(({ text }) => text).join(' '))
    ),
    new HumanMessage(prompt),
  ];
}

export async function runPrompt(
  prompt: string,
  {
    history,
    systemInstruction,
  }: {
    history: StartChatParams['history'];
    systemInstruction: string;
  }
): Promise<MessageContent> {
  const messages = convertToMessages(prompt, history, systemInstruction);

  const response = await model.invoke(messages);

  return response.content;
}