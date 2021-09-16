import { Ticket } from '../ticket'

it('implements opimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'Title',
    price: 5,
    userId: '123'
  })

  // Save the ticket to the database
  await ticket.save()

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 })
  secondInstance!.set({ price: 15 })

  // Save the first fetched ticket
  await firstInstance!.save()

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save()
  } catch (err) {
    // return done()
    // newer version of Jest cannot both take a 'done' callback and return something.
    // Either use a 'done' callback, or return a promise.
    return
  }

  // The logic should not go until this throw statement
  throw new Error('Should not reach this point')
})

it ('increments the version number on multiple saves', async() => {
  const ticket = Ticket.build({
    title: 'Title',
    price: 5,
    userId: '123'
  })

  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})
