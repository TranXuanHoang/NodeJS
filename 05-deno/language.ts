interface Language {
  code: string
  name: string
}

const Languages: Array<Language> = [
  { code: 'de_DE', name: 'German - Germany' },
  { code: 'en_US', name: 'English - United States' },
  { code: 'en_GB', name: 'English - United Kingdom' },
  { code: 'fr_FR', name: 'French - France' },
  { code: 'it_IT', name: 'Italian - Italy' },
  { code: 'ja_JP', name: 'Japanese - Japan' },
  { code: 'vi_VN', name: 'Vietnamese - Vietnam' }
]

class Greeting {
  language: Language
  say: string

  constructor(langCode: string) {
    const englishUS = { code: 'en_US', name: 'English - United States' }
    this.language = Languages.find(l => l.code === langCode) || englishUS
    this.say = this.greet()
  }

  greet() {
    switch (this.language.code) {
      case 'de_DE':
        return 'Hallo'
      case 'en_GB':
      case 'en_US':
        return 'Hello'
      case 'fr_FR':
        return 'Bonjour'
      case 'it_IT':
        return 'Ciao'
      case 'ja_JP':
        return 'こんにちは'
      case 'vi_VN':
        return 'Xin chào'
      default:
        return 'Hello'
    }
  }
}

const greetings = [
  new Greeting('de_DE'),
  new Greeting('it_IT'),
  new Greeting('vi_VN')
]

const encoder = new TextEncoder()
const decoder = new TextDecoder()

greetings.forEach(greeting => {
  const dataLine = `${greeting.language.name}: ${greeting.say}\n`
  const encodedData = encoder.encode(dataLine)

  Deno.writeFile('greetings.txt', encodedData, { append: true }).then(() => {
    console.log(`Wrote to file: ${dataLine}`)
  })
})

import { serve } from "https://deno.land/std/http/server.ts";
const server = serve({ port: 3000 })
console.log('Listening on http://localhost:3000/')

for await (const req of server) {
  // Interpret and parse request body to JavaScript object
  const bodyBuf: Uint8Array = await Deno.readAll(req.body)
  const bodyContent: string = decoder.decode(bodyBuf)
  let body
  try {
    body = JSON.parse(bodyContent)
  } catch (error) { }

  // Print out request information (method, url and body)
  console.log(`${req.method} ${req.url}`)
  if (body) {
    console.log(body)
  }

  // Respond to each request
  req.respond({
    status: 200,
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify({
      greetings
    })
  })
}
