import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'



const CreatePost = () => {
  const router = useRouter();
    
  const [genre_id, setGenre_id] = useState(1);
  const [explanation, setExplanation] = useState("");
  const [genres, setGenres] = useState([]);
  const [post , setPost] = useState({id: -1, user_id: -1, genre_id: -1,explanation: "", sound_path: "", genre: {}});

  const { postId } = router.query;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await laravelAxios.get('/api/genres');
        setGenres(response.data.genres);
      } catch(err) {
        console.log(err);
      }
    }
    fetchGenres();
  },[]);

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
          console.log(response.data.post.explanation);
          setExplanation(response.data.post.explanation);
          setGenre_id(response.data.post.genre_id);
        } catch(err) {
          console.log(err);
        }
      }
    }

    fetchPost();
  },[postId]);


  
  const UpdataSound = async () => {
    try {
      const response = await laravelAxios.put(`/api/posts/${postId}`, {
        genre_id: genre_id,
        explanation: explanation
      });

      console.log(response.data);
      router.push(`/post/${response.data.post.id}`);
    } catch(err) {
      console.log(err);
    }
    
  }



  return (
    <AppLayout sx={{textAlign: 'center'}}
        header={
          <h3>
                Create
          </h3>
        }>


        <Head>
            <title>Laravel - Create</title>
        </Head>
      
      
   



      <div class=" items-center justify-center w-100 h-28">
        <h1 class="text-4xl text-black-700 text-center font-semibold">Edit your audio post</h1>
  
        
            <div class="flex justify-center items-center mx-auto text-black-700 font-semibold w-7/12 p-5 my-10">
                      <a href={post.sound_path}>
                        <img src="../../../images/audio.png" alt="再生">
                          </img>
                          </a>
            </div>

         
          <textarea class="flex mx-auto text-black-700 text-center font-semibold w-7/12 p-5 my-10" placeholder="Comment" onChange={(e) => setExplanation(e.target.value)} value={explanation}/>

   
        <select class="flex mx-auto text-black-700 text-center font-semibold w-7/12 p-5 my-10" name="post[genre_id]" onChange={(e) => setGenre_id(e.target.value)}>
        {genres.map((genre) => (
          genre.id === post.genre_id ? <option key={genres.id} value={genre.id} selected>{genre.name}</option> : <option key={genres.id} value={genre.id}>{genre.name}</option>
     ))}
     
	      </select>


        <div class= "flex items-center justify-center">
        <button onClick={UpdataSound} class='flex items-center justify-center text-center w-7/12 p-5 my-10 bg-orange hover:bg-red-200 text-black font-bold py-2 px-4 rounded-full'>Upload</button>
        </div>
      </div>
      
    </AppLayout>
  );
};

export default CreatePost;