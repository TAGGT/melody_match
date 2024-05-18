import laravelAxios from '@/lib/laravelAxios'
import { useEffect, useState } from "react"
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'



const CreatePost = () => {
  const router = useRouter();
    
  const [genre_id, setGenre_id] = useState(1);
  const [audio, setAudio] = useState();
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
    const formData = new FormData();
    formData.append('genre_id', Number(genre_id));
    formData.append('audio', audio);
    formData.append('explanation', explanation);
  
    try {
      const response = await laravelAxios.post(`/api/posts/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log(response.data);
      router.push(`/post/${response.data.post.id}`);
    } catch (err) {
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
  
       
        
          <input class="flex mx-auto text-black-700 text-center font-semibold w-7/12 p-5 my-10" type='file' accept='audio/*' onChange={(e) => setAudio(e.target.files[0])} />

        
          <textarea class="flex mx-auto text-black-700 text-center font-semibold w-7/12 p-5 my-10" placeholder="Comment" onChange={(e) => setExplanation(e.target.value)}>
          {explanation}
          </textarea>


        
        <select class="flex mx-auto text-black-700 text-center font-semibold text-center w-7/12 p-5 my-10" name="post[genre_id]" onChange={(e) => setGenre_id(e.target.value)}>
        {genres.map((genre) => (
          <option key={genres.id} value={genre.id}>{genre.name}</option>
       
     ))}
	      </select>


        <div class= "flex items-center justify-center">
        <button onClick={postSound} class='flex items-center justify-center text-center w-7/12 p-5 my-10 rounded border-black bg-orange text-2xl font-semibold'>Upload</button>
        </div>
      </div>
      
    
      
      
    </AppLayout>
  );
};

export default CreatePost;
