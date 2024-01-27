import { openai } from 'service/openai';
import type { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { codeBlocks } from './prompts';

export const invokeOrThrow = async <T extends z.AnyZodObject>(
  prompt: string,
  validator: T
): Promise<z.infer<T>> => {
  const jsonSchema = zodToJsonSchema(validator);
  const input = `${prompt}

ステップ・バイ・ステップで考えましょう。
返答は必ず以下のJSON schemas通りにしてください。
${codeBlocks.valToJson(jsonSchema)}
`;

  return await openai.chat.completions
    .create({
      model: 'gpt-4-1106-preview',
      temperature: 1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'あなたは優れたアイディアを出すアイディアマンとしてアイディアに意見をください。返答は必ず日本語で答えてください',
        },
        { role: 'user', content: input },
      ],
    })
    .then((response) => {
      const content = response.choices[0].message.content;
      if (!content) throw new Error('No content');
      console.log(content);

      return validator.parse(JSON.parse(content));
    })
    .catch((e) => {
      console.error(e);

      return invokeOrThrow(prompt, validator);
    });
};
