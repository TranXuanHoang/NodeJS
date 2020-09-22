enum LanguageCode {
  de_DE = 'German - Germany',
  en_GB = 'English - United Kingdom',
  en_US = 'English - United States',
  fr_FR = 'French - France',
  it_IT = 'Italian - Italy',
  ja_JP = 'Japanese - Japan',
  vi_VN = 'Vietnamese - Vietnam'
}

class Language {
  langCode: LanguageCode

  constructor(langCode: LanguageCode) {
    this.langCode = langCode
  }

  greet() {
    switch (this.langCode) {
      case LanguageCode.de_DE:
        return 'Hallo'
      case LanguageCode.en_GB:
      case LanguageCode.en_US:
        return 'Hello'
      case LanguageCode.fr_FR:
        return 'Bonjour'
      case LanguageCode.it_IT:
        return 'Ciao'
      case LanguageCode.ja_JP:
        return 'こんにちは'
      case LanguageCode.vi_VN:
        return 'Xin chào'
      default:
        return 'Hello'
    }
  }
}

const german = new Language(LanguageCode.de_DE)
const italian = new Language(LanguageCode.it_IT)
const vietnamese = new Language(LanguageCode.vi_VN)

const languages = [german, italian, vietnamese]

const encoder = new TextEncoder()

languages.forEach(language => {
  console.log(language.greet())
  const dataLine = `${language.langCode}: ${language.greet()}\n`
  const greeting = encoder.encode(dataLine)

  Deno.writeFile('greetings.txt', greeting, { append: true }).then(() => {
    console.log(`Wrote to file: ${dataLine}`)
  })
})
