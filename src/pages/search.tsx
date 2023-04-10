import { useSession, signIn, signOut } from "next-auth/react"


export default function SearchPage() {
  const { data: session, status } = useSession()
  if (session) {
      return (
          <>
          <h2>Bem-vindo à pagina de pesquisa</h2>
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