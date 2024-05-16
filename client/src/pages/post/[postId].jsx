import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'



// POINT input要素、textarea要素の使い方
const PostDetail = () => {
  const { user } = useAuth({ middleware: 'auth' })

  //about quiz state
  const [replies, setReplies] = useState([]);
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

  
  //未完成
  const deleteReply = async (replyId) => {
    /*
    try {
      const response = await laravelAxios.delete(`api/reply/${replyId}`);

    } catch(err) {
      console.log(err);
    }
    */
  }

  //未完成
  const postReply = async () => {

    try {
      const response = await laravelAxios.post(`api/replies/${postId}`, {
        text: text,
        post_id: postId
      });

      console.log(response.data);
      setReplies(response.data);
      setText("");

    } catch(err) {
      console.log(err);
    }
    
  }

  
  return (

    <AppLayout sx={{textAlign: 'center'}}
        header={
          <h3>
                詳細表示
          </h3>
        }>
        <Head>
            <title>Laravel - 詳細</title>
        </Head>
      
      <div>
        <h3>問題概要</h3>
        <p>{post.explanation}</p>
        {/* 後で書き換える */}
        <button>再生</button>
      </div>

      <div class="post-detail">
        <div class="tag border-gray-400 w-2/3 border-solid border-2 rounded p-3 m-2">          
          <p>リプライ投稿<br />
          <textarea cols="20" rows="2" onChange={(e) => setText(e.target.value)} value={text}/></p>
        </div>
      </div>
      
      <button onClick={() => postReply()}>問題を追加</button>

      <div>
        <h3>リプライ一覧</h3>
        
        {replies.map((reply, index) => (
          <>
            <div key={reply.id}>
              <p>{reply.user.name}:{reply.text}</p>
              {user.id === reply.user.id && <button>削除</button>}
              {user.id === reply.user.id && <button>編集</button>}
            </div> 
          </>
        ))}


      </div>
    </AppLayout>
  );
};

export default PostDetail;