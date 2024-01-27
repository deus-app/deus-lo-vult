export const codeBlocks = {
  fromText: (text: string, ext: string): string => `\`\`\`${ext}\n${text}\n\`\`\``,
  valToJson: (val: Record<string, unknown> | Record<string, unknown>[]): string =>
    `\`\`\`json\n${JSON.stringify(val, null, 2)}\n\`\`\``,
};

export const prompts = {
  webServiceArea: (): string =>
    `これから新規webサービスを立ち上げようとしています。
    以下のポイントを踏まえてwebサービスの領域と選定理由を教えてください。
    ・市場とニーズ - どのような市場で、どのようなニーズがあるか
    ・競合 - どのような競合がいるか
    ・将来性 - 今後どのように変化していくか`,
  webServiceIdea: (webServiceArea: string, selectReason: string): string =>
    `${selectReason}という理由から${webServiceArea}という領域で新たなwebサービスを開発しようとしています。
    ${webServiceArea}について、解像度を高め、新規サービスを考えてください。`,
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
