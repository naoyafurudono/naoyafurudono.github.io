import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function Page() {
  const users = await prisma.user.findMany()
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.systemID}>
            {user.userID}
          </li>
        ))}
      </ul>
    </div>
  )
}