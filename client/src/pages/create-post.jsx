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
      
      
      <div>
        <h3>ジャンル</h3>
        <select name="post[genre_id]" onChange={(e) => setGenre_id(e.target.value)}>
        {genres.map((genre) => (
          <option key={genres.id} value={genre.id}>{genre.name}</option>
        
        ))}
	      </select>

        <h3>url</h3>


        <textarea placeholder="urlを記入してください"  onChange={(e) => setSoundPath(e.target.value)}>
        {sound_path}
        </textarea>
        <h3>問題概要</h3>

        <textarea placeholder="問題の概要を記入してください" onChange={(e) => setExplanation(e.target.value)}>
        {explanation}
        </textarea>
      </div>
      <button onClick={postSound}>投稿</button>
    </AppLayout>
  );
};

export default CreatePost;