import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import laravelAxios from '@/lib/laravelAxios';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from 'axios';


const ToukouIchiran = () => {
    const [toukous, setToukous] = useState([]);
    const [japantoukous, setJapanToukous] = useState([]);
    const [foeigntoukous, setFoeignToukous] = useState([]);
    const [insttoukous, setInstToukous] = useState([]);

    const { user } = useAuth({ middleware: 'auth' });
    const router = useRouter();
    const { postId } = router.query;

    const genreFilter = () => {
        setJapanToukous(toukous.filter((toukou) => toukou.genre_id === 1));
        setFoeignToukous(toukous.filter((toukou) => toukou.genre_id === 2));
        setInstToukous(toukous.filter((toukou) => toukou.genre_id === 3));
    };

    useEffect(() => {
        const getToukous = async () => {
            try {
                const response = await laravelAxios.get('/api/posts/');
                setToukous(response.data.posts);
                console.log(response.data.posts); // ここでログを出力して確認
            } catch (error) {
                console.error("Error:", error);
            }
        };

        getToukous();
    }, []);

    useEffect(() => {
        genreFilter(); // toukous が更新されたときに実行する
    }, [toukous]); // toukous が更新されたときに実行する


    


  return (
    <>
        <AppLayout>
            <div className="flex justify-center ">
                <div className = "bg-orange m-4 rounded p-4">
                    <p className = "text-3xl">Japanese music</p>
                    <div className = "h-[700px] overflow-auto">
                        {japantoukous.map((japantoukou) => (
                            <div key={japantoukou.id} onClick={() => router.push(`/post/${japantoukou.id}`)} className = "bg-white m-4 rounded p-4" >
                                <div>{japantoukou.user_id}</div>
                                <div className = " flex justify-center">
                                    <div>{japantoukou.explanation}</div>
                                    <a href={japantoukou.sound_path}><img src="../../../images/audio.png" alt="再生"></img></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className = "bg-orange m-4 rounded p-4 ">
                    <p className = "text-3xl">Foreign music</p>
                    <div className = "h-[700px] overflow-auto">
                        {foeigntoukous.map((foeigntoukou) => (
                            <div key={foeigntoukou.id} onClick={() => router.push(`/post/${foeigntoukou.id}`)} className = "bg-white m-4 rounded p-4">
                                <div>{foeigntoukou.user_id}</div>
                                <div className = " flex justify-center">
                                    <div>{foeigntoukou.explanation}</div>
                                    <a href={foeigntoukou.sound_path}><img src="../../../images/audio.png" alt="再生"></img></a>
                                </div>
                            </div>
                         ))}
                    </div>
                </div>
                <div className = "bg-orange m-4 rounded p-4">
                    <p className = "text-3xl">Instrumental music</p>
                    <div className = "h-[700px] overflow-auto">
                        {insttoukous.map((insttoukou) => (
                            <div key={insttoukou.id} onClick={() => router.push(`/post/${insttoukou.id}`)} className = "bg-white m-4 rounded p-4">
                                <div>{insttoukou.user_id}</div>
                                <div className = " flex justify-center">
                                    <div>{insttoukou.explanation}</div>
                                    <a href={insttoukou.sound_path}><img src="../../../images/audio.png" alt="再生"></img></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    </>
  )
}

export default ToukouIchiran