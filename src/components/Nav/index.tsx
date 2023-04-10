import { NextPage } from "next";
import Link from "next/link";

export default function Nav() {
    return (
        <nav>
            <ul className="flex justify-between items-center p-8">
                <li>
                    <Link href="/" className="text-blue-500 no-underline">
                        Evecoding
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="text-blue-500 no-underline">
                        Profile
                    </Link>
                </li>
                <li>
                    <Link href="/search" className="text-blue-500 no-underline">
                        Search
                    </Link>
                </li>
            </ul>
        </nav>
    )
}