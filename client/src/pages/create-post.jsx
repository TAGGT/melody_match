import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'



const CreatePost = () => {
  const router = useRouter();
    
  const [genre_id, setGenre_id] = useState(1);
  const [sound_path, setSoundPath] = useState("");
  const [explanation, setExplanation] = useState("");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await laravelAxios.get('/api/genres');
        console.log(response.data);
        setGenres(response.data.genres);
      } catch(err) {
        console.log(err);
      }
    }
    fetchGenres();
  },[]);

  const postSound = async () => {
    try {
      const response = await laravelAxios.post(`/api/posts/`, {
        genre_id: Number(genre_id),
        sound_path: sound_path,
        explanation: explanation
      })

      router.push(`/post/${response.data.post.id}`);
    }catch(err) {
      console.log(err);
    }    

    
  };



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
        <h1 class="text-4xl text-black-700 text-center font-semibold">Post your audio file</h1>
  
       
          <h3 class="text-4xl text-black-700 text-center font-semibold">url</h3>
          <textarea  class="flex mx-auto text-black-700 text-center font-semibold" placeholder="urlを記入してください"  onChange={(e) => setSoundPath(e.target.value)}>
          {sound_path}
          </textarea>

          <h3 class="text-4xl text-black-700 text-center font-semibold">comment</h3>
          <textarea class="flex mx-auto text-black-700 text-center font-semibold" placeholder="Comment" onChange={(e) => setExplanation(e.target.value)}>
          {explanation}
          </textarea>

        <h3 class="text-4xl text-black-700 text-center font-semibold">ジャンル</h3>
        <select class="flex mx-auto text-black-700 text-center font-semibold" name="post[genre_id]" onChange={(e) => setGenre_id(e.target.value)}>
        {genres.map((genre) => (
          <option key={genres.id} value={genre.id}>{genre.name}</option>
       
     ))}
	      </select>
        <div class= "flex items-center justify-center">
        <button class='flex text-center p-10 my-5 rounded border-black bg-orange '>Upload</button>
        </div>
      </div>
      
    
      
      
    </AppLayout>
  );
};

export default CreatePost;
