import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'

export default function Home() {
    const { user } = useAuth({ middleware: 'guest' })

    return (
        <>
            <Head>
                <title>Laravel</title>
            </Head>

            <div className="">
                <div className="hidden fixed h-screen right-24 top-3/4 px-6 py-4 sm:block">
                    {user ? (
                        <Link
                            href="/dashboard">
                            <button  className="px-24 py-2 ml-4 text-sm text-white rounded-full bg-black inset-x-0 bottom-0">
                                Dashboard
                            </button>
                        </Link>
                    ) : (
                        <> 
                            <Link href="/login">
                                <button className="px-24 py-2 ml-4 text-sm text-white rounded-full bg-black inset-x-0 bottom-0 left-2 border border-white-500 border-2">
                                    Login
                                </button>
                            </Link>
                            

                            <Link
                                href="/register">
                                <button className="px-24 py-2 ml-4 text-sm text-white rounded-full bg-black inset-x-0 bottom-0 border border-white-500 border-2">
                                    Register
                                </button>
                            </Link>
                        </>
                    )}
                </div>


                <div className="">
                    <div className="h-screen w-screen bg-[url('../../public/images/pic_drum.jpg')] z-10">
                        <img  src = '../../images/Melody_match_logo.png' className = "z-20 object-contain scale-50 absolute inset-y-3.5"></img>
                    </div>
                </div> 

            </div>
        </>
    )
}
