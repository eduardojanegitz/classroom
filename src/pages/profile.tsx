import { useSession, signIn, signOut } from "next-auth/react"
import useSWR from 'swr';
import api from "../../utils/api";

export default function Home() {
  const { data: session, status } = useSession();

  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api)

  if (error) {
    console.log(error)
  }

  if (data) {
    console.log(data)
  }

  if (!session) {
    return (
      <>
        <h2>Por favor, realize o login na página...</h2>
        Not signed in <br />
        <button onClick={() => signIn('auth0')}>Sign in</button>
      </>
    )
    // } else if (status === "loading") {
    //   return <p>Loading...</p>
  } else if (error) {
    <h1>O usuário com e-mail {session.user.email} não existe</h1>
  } else {

    return (
      <>
        <h2>Bemvindo</h2>
        <p>Nome: {data.data.name}</p>
        <p>Coins: {data.data.coins}</p>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

} 