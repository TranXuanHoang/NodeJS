export enum OrderStatus {
  /** Order has been created, but the ticket it is trying to
   * order has not been reserved. */
  Created = 'created',

  /** Either one of the following cases:
   * - The ticket the order is trying to reserve has already
   * been reserved,
   * - Or when the user has cancelled the order,
   * - Or when the order expires before payment. */
  Cancelled = 'cancelled',

  /** The order has successfully reserved the ticket. */
  AwaitingPayment = 'awaiting:payment',

  /** The order has reserved the ticket and the user has provided
   * payment successfully. */
  Complete = 'complete'
}
