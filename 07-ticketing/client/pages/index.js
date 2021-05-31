import Link from 'next/link'

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket =>
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        {ticket.orderId
          ?
          <span className="badge badge-info">Reserved</span>
          :
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        }
      </td>
    </tr>
  )

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // This method is run on server side usually to run code
  // that fetch additional data and other related logic
  // then return the so-called props to the JSX rendering function.

  const { data } = await client.get('/api/tickets')

  return { tickets: data }
}

export default LandingPage
