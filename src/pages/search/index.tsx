import { useSession, signIn, signOut } from "next-auth/react"
import { useCallback, useState } from "react"
import api from "../../../utils/api";
import Link from "next/link";

interface Teacher {
    _id: string;
    name: string;
    email: string;
    phone: string;
    teacher: boolean;
    coins: number;
    courses: string[];
    available_hours: Record<string, number[]>;
    available_locations: string[];
    reviews: Record<string, unknown>[];
    appointments: Record<string, unknown>[];
}

export default function SearchPage() {
    const { data: session, status } = useSession();
    const [data, setData] = useState<Teacher[]>([]);
    const [textInput, setTextInput] = useState('');

    const handleSearch = useCallback(() => {
        api(`/api/search/${textInput}`).then((response) => {
            const teacher: Teacher[] = response.data;

            setData(teacher)
        }
        );
    }, [textInput, setData]);

    if (!session) {
        return (
            <>
                Not signed in <br />
                <button onClick={() => signIn('auth0')}>Sign in</button>
            </>
        )
        // }  if(status === "loading") {
        //   return <p>Loading...</p>
        // }
    } else {
        return (
            <>
                <h2>Bem-vindo à pagina de pesquisa</h2>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
                <input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    type="text"
                    placeholder="Digite o nome da matéria"
                />

                <button type="submit" onClick={handleSearch}>Pesquisar</button>
                {data.length != 0 &&
                    data.map((teacher) => (
                    <Link href={`/search/${teacher._id}`} 
                    key={teacher._id}>
                        <h1 >{teacher.name}</h1>
                    </Link>    
                    )
                    )}
            </>
        )
    }
}