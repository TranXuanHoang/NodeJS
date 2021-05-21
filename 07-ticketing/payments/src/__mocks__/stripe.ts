export const stripe = {
  charges: {
    create: jest.fn()
      // Automatically resolve a Promise of an object representing the
      // response when calling stripe.charges.create().
      // This mock function is then used to test code like below
      //   await stripe.charges.create({
      //     currency: 'usd',
      //     amount: order.price * 100,
      //     source: token
      //   })
      .mockResolvedValue({ id: 'stripeId' })
  }
}
