import { useSession, signIn, signOut } from "next-auth/react"
import useSWR from 'swr';
import api from "../../utils/api";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [isTeacher, setIsTeacher] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [courses, setCourses] = useState("");
  const [availableLocations, setAvailableLocations] = useState("");
  // const [availableHours, setAvailableHours] = useState<Record<string, number[]>>({});
  const [monday, setMonday] = useState("");
  const [tuesday, setTuesday] = useState("");
  const [wednesday, setWednesday] = useState("");
  const [thursday, setThursday] = useState("");
  const [friday, setFriday] = useState("");
  const [loggedWithoutAccount, setLoggedWithoutAccount] = useState(
    false
  );

  const { data, error } = useSWR(!loggedWithoutAccount  ? `/api/user/${session?.user.email}` : null, api)

  useEffect(() => {
    if(error) setLoggedWithoutAccount(true)
  }, [error]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      name,
      email,
      phone,
      courses: courses.split(',').map((item) => item.trim()),
      availableLocations: availableLocations.split(',').map((item) => item.trim())
    };

    console.log(data)
  }

  // if (error) {
  //   console.log(error)
  // }
  // if (data) {
  //   console.log(data)
  // }

  if (!session && !data) {
    return (
      <>
        <h2>Por favor, realize o login na página...</h2>
        <button onClick={() => signIn('auth0')}>Sign in</button>
      </>
    )
    // } else if (status === "loading") {
    //   return <p>Loading...</p>
  } else if (loggedWithoutAccount) {
    return (
      <>
        <h1>Seja bem-vindo ao CLASSROOM.</h1>
        <h1>Por favor, finaliza a criação do seu perfil:</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value) }}
            placeholder="Nome completo" />
          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder="E-mail" />
          <input
            type="text"
            value={phone}
            onChange={(e) => { setPhone(e.target.value) }}
            placeholder="Telefone" />
          <div>
            <h1>Você é um professor?</h1>
            <div onClick={() => setIsTeacher(true)}>Sim</div>
            <div onClick={() => setIsTeacher(false)}>Não</div>
          </div>
          {isTeacher && (
            <>
              <h1>Escreva suas matérias (separadas por virgula)</h1>
              <input
                type="text"
                value={courses}
                onChange={(e) => { setCourses(e.target.value) }}
                placeholder="Matérias que você vai lecionar" />
              <h1>Escreva em quais locais você pode dar aula (separadas por virgula)</h1>
              <input
                type="text"
                value={availableLocations}
                onChange={(e) => { setAvailableLocations(e.target.value) }}
                placeholder="Ex: Refeitório, etc." />
              <h1>Escreva os horários que você pode dar aula (separadas por virgula)</h1>
              <h2>Segunda:</h2>
              <input
                type="text"
                value={monday}
                onChange={(e) => { setMonday(e.target.value) }}
                placeholder="8h, 9h, etc" />
              <h2>Terça:</h2>
              <input
                type="text"
                value={tuesday}
                onChange={(e) => { setTuesday(e.target.value) }}
                placeholder="8h, 9h, etc" />
              <h2>Quarta:</h2>
              <input
                type="text"
                value={wednesday}
                onChange={(e) => { setWednesday(e.target.value) }}
                placeholder="8h, 9h, etc" />
              <h2>Quinta:</h2>
              <input
                type="text"
                value={thursday}
                onChange={(e) => { setThursday(e.target.value) }}
                placeholder="8h, 9h, etc" />
              <h2>Sexta:</h2>
              <input
                type="text"
                value={friday}
                onChange={(e) => { setFriday(e.target.value) }}
                placeholder="8h, 9h, etc" />
            </>
          )}
          {isTeacher === false && <h1>Perfeito! Seu perfil pode ser criado</h1>}
          <button type="submit">Criar perfil</button>
        </form>
      </>
    )
  } else if (session && data) {


    // if(data?.data.name && data?.data.coins && session?.user.email) {
    //   <h1>Usuário não encontrado</h1>
    // }

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