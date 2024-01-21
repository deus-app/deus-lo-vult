export const codeBlocks = {
  fromText: (text: string, ext: string): string => `\`\`\`${ext}\n${text}\n\`\`\``,
  valToJson: (val: Record<string, unknown> | Record<string, unknown>[]): string =>
    `\`\`\`json\n${JSON.stringify(val, null, 2)}\n\`\`\``,
};

export const prompts = {
  webServiceArea: (): string => 'これから売れるWebサービスの領域を1つ考えてください。',
  webServiceIdea: (webServiceArea: string): string =>
    `${webServiceArea}について、解像度を高め、新規サービスを考えてください。`,
  feedback: (ideaName: string, description: string): string =>
    `${ideaName}というサービスがあります。
    サービスの説明は以下の通りです。
    ${description}
    
    このサービスについて、フィードバックをください。
    もし、このサービスがあなたの判断基準で95点以上と感じたら、返答のJsonのcompleteをtrueにしてください。`,
  improvement: (ideaName: string, description: string, feedback: string): string =>
    `${ideaName}というサービスがあります。
    サービスの説明は以下の通りです。
    ${description}
    
    これに対して以下のフィードバックをもらいました。
    ${feedback}
    
    このフィードバックを元に、サービスを改善してください。`,
  complete: (ideaName: string, description: string): string =>
    `${ideaName}というサービスがあります。
    サービスの説明は以下の通りです。
    ${description}
    
    このサービスのサービス名を考えてください。
    また、このサービスと似たサービスを教えてください。`,
};
