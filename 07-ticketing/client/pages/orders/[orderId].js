import Router from 'next/router'
import { useEffect, useState } from "react"
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    // First call findTimeLeft() immediately so that we don't have
    // to wait for 1s at the beginning
    findTimeLeft()

    // Then call findTimeLeft one every second
    const timerId = setInterval(findTimeLeft, 1000)

    // Return a function so that the timer will be destroyed
    // when navigating away from the component
    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return <div>
    Time left to pay: {timeLeft} seconds
    <StripeCheckout
      token={({ id }) => {
        doRequest({ token: id })
      }}
      // Should put the publish key to a separate file or pass in as an environment variable
      stripeKey="pk_test_51IreSzAZMJkkVU2ZU9Sdc5zBiBfPoSGg7D1rSiHaciWmM1J7WWn0EQw0OklYTiItUSuCpFuki0TCfJHLePihns3J00YvanscQa"
      amount={order.ticket.price * 100}
      email={currentUser.email}
    />
    {errors}
  </div>
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
