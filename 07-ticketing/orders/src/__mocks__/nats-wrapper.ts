/** Fakes the ../nat-wrapper.ts so that we can test our app
 * without having to connect to a real NATS Streaming Server */
export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
        callback()
      }
    )
  }
}
