export const codeBlocks = {
  fromText: (text: string, ext: string) => `\`\`\`${ext}\n${text}\n\`\`\``,
  valToJson: (val: Record<string, unknown> | Record<string, unknown>[]) =>
    `\`\`\`json\n${JSON.stringify(val, null, 2)}\n\`\`\``,
};

export const prompts = {
  webServiceIdea: () => 'これから売れるWebサービスの領域を1つ考えてください。',
  followUp: (webServiceArea: string) =>
    `${webServiceArea}について、解像度を高め、新規サービスの名前と、類似サービスを教えてください。`,
};
