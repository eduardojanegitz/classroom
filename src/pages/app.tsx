import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session, status } = useSession()
  if (session) {
      return (
          <>
          <h2>Bemvindo</h2>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )
    }  if(status === "loading") {
      return <p>Loading...</p>
    }
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn('auth0')}>Sign in</button>
      </>
    )
   
} 