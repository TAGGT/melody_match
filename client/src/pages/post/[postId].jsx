import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/auth';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
// import { audioPlay } from '@mui/icons-material/PlayCircleFilledWhite';


// POINT input要素、textarea要素の使い方
const PostDetail = () => {
  const { user } = useAuth({ middleware: 'auth'})

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

  //　リプライの投稿
  const postReply = async () => {

    try {
      const response = await laravelAxios.post(`api/replies/${postId}`, {
        text: text,
        post_id: postId
      });

      setReplies(response.data);
      setText("");

    } catch(err) {
      console.log(err);
    }
    
  }

  
  return (

    <AppLayout sx={{textAlign: 'center'} }
        header={
          <h3>
                詳細表示
          </h3>
        }>
        <Head>
            <title>Laravel - 詳細</title>
        </Head>


        <div class="flex flex-row overflow-hidden">
          <div class="basis-2/5">

            <div class="flex flex-col">

              <div className='mt-8 ml-20 h-screen'>
                <h3 className='ml-4'>投稿内容</h3>
                <div class="tag border-gray-400 w-5/6 h-1/4 border-solid border-2 rounded p-3 m-2 lex flex-col">   
                  <p class="h-5/6">{post.explanation}</p>
                {/* 後で書き換える */}
                  <div class="mb-0 text-right mr-1">
                    {/* <div><audioPlay className="h-5 w-5"/></div>  */}
                    <button>再生する</button>
                  </div>
                </div>
              </div>

              <div class="post-detail ml-24 mt-8 absolute bottom-8">
                <p>リプライ投稿<br/>
                  <textarea cols="40" rows="4" onChange={(e) => setText(e.target.value)} value={text} border-gray-400/>
                </p>
                <div class="text-right mr-4">
                  <button onClick={() => postReply()}>投稿する</button>
                </div>
              </div>
            </div>
          </div>

          <div class="basis-3/5 ml-12">
            <h3 class="mt-8 text-center mr-12">リプライ一覧</h3>
            <div class="bg-[url('/images/comment.png')] mt-4 w-5/6 h-screen bg-contain bg-no-repeat">
              
              
            <div className='absolute top-60 right-36 h-2/3 w-1/2 overflow-y-scroll flex flex-col-reverse'>
              {replies.map((reply, index) => (
                <>
                  <div key={reply.id}>
                    <p class="ml-36 pt-8 underline">{reply.user.name}</p>
                    <p class="ml-36">{reply.text}</p>
                    <div class="flex flex-row-reverse">
                      {user.id === reply.user.id && <button class="pr-6">編集</button>}
                      {user.id === reply.user.id && <button class="pr-3" onClick={() => deleteReply(reply.id)}>削除</button>}
                    </div>
                  </div> 
                </>
              ))}
              </div>
            </div>
          </div>
        </div>

    </AppLayout>
  );
};

export default PostDetail;