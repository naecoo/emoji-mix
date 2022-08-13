export const getEmojiUrl = (emoji: string) => `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u${emoji}.svg`;

export const getMixedEmojiUrl = (emoji1: string, emoji2: string) => `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/u${emoji1}/u${emoji1}_u${emoji2}.png`;
