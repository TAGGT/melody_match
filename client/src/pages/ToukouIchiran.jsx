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
            <div>
                {japantoukous.map((japantoukou) => (
                    <div key={japantoukou.id}>
                        <div>{japantoukou.title}</div>
                        <div>{japantoukou.user_id}</div>
                        <div>{japantoukou.genre_id}</div>
                        <div>{japantoukou.explanation}</div>
                        <div>{japantoukou.sound_path}</div>
                    </div>
                ))}
            </div>
            <div>
                {foeigntoukous.map((foeigntoukou) => (
                    <div key={foeigntoukou.id}>
                        <div>{foeigntoukou.title}</div>
                        <div>{foeigntoukou.user_id}</div>
                        <div>{foeigntoukou.genre_id}</div>
                        <div>{foeigntoukou.explanation}</div>
                        <div>{foeigntoukou.sound_path}</div>
                    </div>
                ))}
            </div>
            <div>
                {insttoukous.map((insttoukou) => (
                    <div key={insttoukou.id}>
                        <div>{insttoukou.title}</div>
                        <div>{insttoukou.user_id}</div>
                        <div>{insttoukou.genre_id}</div>
                        <div>{insttoukou.explanation}</div>
                        <div>{insttoukou.sound_path}</div>
                    </div>
                ))}
            </div>
        </AppLayout>
    </>
  )
}

export default ToukouIchiran