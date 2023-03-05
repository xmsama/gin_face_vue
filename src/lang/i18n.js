// src/i18n/index.ts
import { createI18n } from 'vue-i18n'
import zh from './zh.js'
import tw from './tw.js'
const i18n = createI18n({
  locale: 'tw', // set locale
  messages: {
    zh: zh,
    tw: tw
  },
})

export default i18n
