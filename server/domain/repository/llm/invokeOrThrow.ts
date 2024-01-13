import { openai } from '$/service/openai';

export const invokeOrThrow = async (prompt: string) => {
  const input = `${prompt}`;
  return await openai.chat.completions
    .create({
      model: 'gpt-4-1106-preview',
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: 'あなたは優れたアイディアを出すアイディアマンとしてアイディアに意見をください。',
        },
        { role: 'assistant', content: input },
      ],
    })
    .then((response) => {
      console.log(response.choices[0].message.role);
      const content = response.choices[0].message.content;
      console.log(content);
      return content;
    })
    .catch((e) => {
      console.error(e);
    });
};
