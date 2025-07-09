import { z } from "zod/v4"

const playerSchema = z.object({
  username: z.string(),
  xp: z.number(),
})

// console.log(playerSchema.parse({ username: "billie", xp: 100 })) // { username: 'billie', xp: 100 }
// console.log(playerSchema.parse({ username2: "billie", xp: 100 })) //  "Invalid input: expected string, received undefined"
// console.log(playerSchema.parse({ username: "billie", xp: '100' })) // "message": "Invalid input: expected number, received string"


const playerSchemaValid = z.object({
  username: z.string().max(5),
  xp: z.number(),
  email: z.email(),
  // date: z.iso.datetime(),
  //or
  //если дата приходит в несовсем корректном формате,
  // то это будет проигнорировано
  date: z.iso.datetime({local: true})
})


type PlayerValid = z.infer<typeof playerSchemaValid>;

const player: PlayerValid = {
  username: 'xzxzx', // исправить на больше 5 символов
  xp: 0,
  email: 'rzhavoe.vremya@gmail.com', // что-нибудь удалить
  date: "2024-02-24T16:00:11.6Z",
}

console.log(playerSchemaValid.parse(player).username) // "message": "Too big: expected string to have <=5 characters"
console.log(playerSchemaValid.parse(player).email) // "message": "Invalid email address"
console.log(playerSchemaValid.parse(player).date) // "message": "Invalid email address"
