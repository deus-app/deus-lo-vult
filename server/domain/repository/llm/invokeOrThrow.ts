import { openai } from '$/service/openai';

export const invokeOrThrow = async (prompt: string) => {
  const input = `${prompt}`;
  return await openai.chat.completions
    .create({
      model: 'gpt-4-1106-preview',
      temperature: 1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'あなたは優れたアイディアを出すアイディアマンとしてアイディアに意見をください。',
        },
        { role: 'assistant', content: input },
      ],
    })
    .then((response) => {
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content');
      console.log(content);
      return JSON.parse(content);
    })
    .catch((e) => {
      console.error(e);
    });
};
