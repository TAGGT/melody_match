import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import 'tailwindcss/tailwind.css';


// POINT input要素、textarea要素の使い方
const PostDetail = () => {
  const [replies, setReplies] = useState([]);
  const formRef = useRef(null);
  const scrollRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    const href = window.location.href;

    try {
      const response = await fetch(href, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setReplies((prevMessages) => [...prevMessages, data]);

      // Clear form fields
      formRef.current.reset();

      // Scroll to bottom of the container

      useEffect(() => {
        // Scroll to bottom of the container whenever messages change
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight + 100,
            behavior: 'smooth',
          });
        }
      }, [replies]);


      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };


  
  const { user } = useAuth({ middleware: 'auth'})

  //about quiz state
  //上へ移動 const [replies, setReplies] = useState([]);
  const [post , setPost] = useState({id: -1, user_id: -1, genre_id: -1,explanation: "", sound_path: "", genre: {}});
  const [text, setText] = useState("");

  const router = useRouter();
  const { postId } = router.query;


  useEffect(() => {
    const fetchPost = async () => {
      if(postId)
      {
        try {
          //　アクセスするときのurlはapi.phpのurlをから決めている
          // そのため、/api/posts/${postId}の形になる
          // laravelAxios.getのgetはRoute::getのgetからきている Route::postならlaravelAxios.postになる
          const response = await laravelAxios.get(`/api/posts/${postId}`);
          
          // conosle.log(response.data)でデータが取れているか確認 ブラウザの開発者ツールのconsoleに表示される
          console.log(response.data);
          setPost(response.data.post);
        } catch(err) {
          console.log(err);
        }
      }
    }

    const fetchReplies = async () => {
      if(postId)
      {
        try {
          const response = await laravelAxios.get(`/api/replies/${postId}`);
          console.log(response.data);
          setReplies(response.data);
        } catch(err) {
          console.log(err);
        }
      }
    }
    fetchReplies();
    fetchPost();
  },[postId]);

  
  // リプライの削除　投稿したユーザーのみ削除できる
  const deleteReply = async (replyId) => {
    try {
      const response = await laravelAxios.delete(`api/replies/${replyId}`);
      
      if(response.data.message !== "不正なアクセスです") {
        setReplies(replies.filter((reply) => reply.id !== replyId));
      }
      
    } catch(err) {
      console.log(err);
    }
  }

  // リプライ投稿
  const postReply = async () => {

    try {
      const response = await laravelAxios.post(`api/replies/${postId}`, {
        text: text,
        post_id: postId
      });

      console.log(response.data);
      setReplies(response.data);
      setText("");
      window.location.reload();

    } catch(err) {
      console.log(err);
    }
    
  }

  
  return (
<div class="overflow-hidden">
    <AppLayout sx={{textAlign: 'center'} }
        header={
          <h3>
            詳細表示
          </h3>
        }>
        <Head>
            <title>Laravel - 詳細</title>
        </Head>


        <div class="overflow-hidden h-[700px] flex flex-row">
          <div class="basis-2/5">

            <div class="flex flex-col">

              <div className='mt-8 ml-20 h-screen' class="mt-8 ml-24 text-xl">
                <h3 class="text-xl ml-6 font-semibold">投稿内容</h3>
                <div class="tag border-gray-400 w-5/6 h-44 border-solid border-2 rounded p-3 m-2 lex flex-col">   
                  <p class="h-5/6 text-xl">{post.explanation}</p>
                {/* 後で書き換える */}

                    <audio controls src={post.sound_path} type="audio/mp3" class="h-5/6 text-xl"></audio>

                </div>
              </div>

              <form class="post-detail ml-24 mt-8 absolute bottom-8">
                <p class="text-xl font-semibold">リプライ投稿<br/>
                  <textarea class="mt-2" cols="40" rows="4" onChange={(e) => setText(e.target.value)} value={text} border-gray-400/>
                </p>
                <div ref={formRef} onSubmit={handleSubmit} class="text-right -mr-2">
                  <button type="button" onClick={postReply}><img src ="/images/plane.png" width="85%" height="85%"></img></button>
                </div>
              </form>
            </div>
          </div>

          <div class="basis-3/5 ml-12">
            <h3 class="mt-8 text-center mr-12 text-xl font-semibold">リプライ一覧</h3>
            <div class="bg-[url('/images/comment.png')] mt-4 w-5/6 h-[700px] bg-contain bg-no-repeat">
              
            <div ref={scrollRef} className='overflow-y-auto absolute top-60 right-36 h-2/3 w-1/2 flex flex-col'>
            
              {replies.map((reply, index) => (
                <>
                  <div key={reply.id}>
                    <p class="ml-36 pt-4 underline text-xl">{reply.user.name}</p>
                    <p class="ml-36 text-xl">{reply.text}</p>
                    <div class="flex flex-row-reverse mr-6">
                      {user.id === reply.user.id && <button class="w-12 h-6 pr-3 text-right text-base border border-blue-900 rounded"> 編集</button>}
                      <div class="pl-2"></div>
                      {user.id === reply.user.id && <button class="w-12 h-6 pr-3 text-right text-base border border-blue-900 rounded"> 削除</button>}
                    </div>
                  </div>
                </>
              ))}
              </div>
            </div>
          </div>
        </div>

    </AppLayout>
    </div>
  );
};

export default PostDetail;