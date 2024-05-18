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
      
      
      <div>
        <h3>ジャンル</h3>
        <select name="post[genre_id]" onChange={(e) => setGenre_id(e.target.value)}>
        {genres.map((genre) => (
          <option key={genres.id} value={genre.id}>{genre.name}</option>
        
        ))}
	      </select>

        <h3>url</h3>

        <h3>音声ファイル</h3>
        <input type='file' accept='audio/*' onChange={(e) => setAudio(e.target.files[0])} />
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