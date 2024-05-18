import ApplicationLogo from '@/components/ApplicationLogo'
import Dropdown from '@/components/Dropdown'
import Link from 'next/link'
import NavLink from '@/components/NavLink'
import ResponsiveNavLink, {
    ResponsiveNavButton,
} from '@/components/ResponsiveNavLink'
import { DropdownButton } from '@/components/DropdownLink'
import { useAuth } from '@/hooks/auth'
import { useEffect, useState, useRef } from "react";
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

    // const handleChangeFile = async (event) => {
    //     const _file = event.target.files[0];
    //     const _audioBuffer = await audioContext.current.decodeAudioData( // 追加
    //       await _file.arrayBuffer()
    //     );
    //     setAudioBuffer(_audioBuffer); // 追加
    //   };

    //   const audioContext = useRef(null);
	//   useEffect(()=>{
    //     audioContext.current = new AudioContext();
    //   },[])

    //   const [audioBuffer, setAudioBuffer] = useState(null);

	//   const handleClickPlay = () => { 
    //     // 自動再生ブロックにより停止されたオーディオを再開させる
    //     if (audioContext.current.state === "suspended") {
    //       audioContext.current.resume();
    //     }
    //     // ソースノード生成 ＋ 音声を設定
    //     const sourceNode = audioContext.current.createBufferSource();
    //     sourceNode.buffer = audioBuffer;
    //     // 出力先に接続
    //     sourceNode.connect(audioContext.current.destination);
    //     // 再生発火
    //     sourceNode.start();
    // };


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
                                <div>{japantoukou.explanation}</div>
                                <audio controls src={japantoukou.sound_path} type="audio/mp3"></audio>
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
                                <div>{foeigntoukou.explanation}</div>
                                <audio controls src={foeigntoukou.sound_path} type="audio/mp3"></audio>
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
                                <div>{insttoukou.explanation}</div>
                                <audio controls src={insttoukou.sound_path} type="audio/mp3"></audio>
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