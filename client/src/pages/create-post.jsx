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
  const [record, setRecord] = useState(false);

  async function audioRecord(){
    try {
      const buttonStart = document.querySelector('#buttonStart')
      const buttonStop = document.querySelector('#buttonStop')
      const sound = document.querySelector('#audio')
      const Finput = document.querySelector('#failinp')
      failinp
      console.log(buttonStart)


      const stream = await navigator.mediaDevices.getUserMedia({ // <1>
        video: false,
        audio: true,
      })
  
      const [track] = stream.getAudioTracks()
      const settings = track.getSettings() // <2>
  
      const audioContext = new AudioContext() 
      await audioContext.audioWorklet.addModule('../../../js/audio-recorder.js') // <3>
  
  
      const mediaStreamSource = audioContext.createMediaStreamSource(stream) // <4>
      const audioRecorder = new AudioWorkletNode(audioContext, 'audio-recorder') // <5>
      const buffers = []
  
  
  
      audioRecorder.port.addEventListener('message', event => { // <6>
        buffers.push(event.data.buffer)
      })
      audioRecorder.port.start() // <7>
  
      mediaStreamSource.connect(audioRecorder) // <8>
      audioRecorder.connect(audioContext.destination)
  
      buttonStart.addEventListener('click', event => {
        buttonStart.setAttribute('disabled', 'disabled')
        buttonStop.removeAttribute('disabled')
  
        const parameter = audioRecorder.parameters.get('isRecording')
        parameter.setValueAtTime(1, audioContext.currentTime) // <9>
  
        buffers.splice(0, buffers.length)
      })
  
      buttonStop.addEventListener('click', event => {
        buttonStop.setAttribute('disabled', 'disabled')
        buttonStart.removeAttribute('disabled')
  
        const parameter = audioRecorder.parameters.get('isRecording')
        parameter.setValueAtTime(0, audioContext.currentTime) // <10>
        console.log(Finput);
        
  
        const blob = encodeAudio(buffers, settings) // <11>
        setAudio(blob);
  
        const url = URL.createObjectURL(blob)
  
        sound.src = url
      })
  
    } catch (err) {
      console.error(err)
    }
  }

  audioRecord();

  useEffect(() => {
    const record_audio = document.querySelector('#record-audio')
    const file_audio = document.querySelector('#file-audio')

    if (record) {
      file_audio.setAttribute('hidden', 'hidden')
      record_audio.removeAttribute('hidden')
    } else{
      record_audio.setAttribute('hidden', 'hidden')
      file_audio.removeAttribute('hidden')
    }
  }, [record])

  

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


  function encodeAudio (buffers, settings) {
    const sampleCount = buffers.reduce((memo, buffer) => {
      return memo + buffer.length
    }, 0)
  
    const bytesPerSample = settings.sampleSize / 8
    const bitsPerByte = 8
    const dataLength = sampleCount * bytesPerSample
    const sampleRate = settings.sampleRate
  
    const arrayBuffer = new ArrayBuffer(44 + dataLength)
    const dataView = new DataView(arrayBuffer)
  
    dataView.setUint8(0, 'R'.charCodeAt(0)) // <10>
    dataView.setUint8(1, 'I'.charCodeAt(0))
    dataView.setUint8(2, 'F'.charCodeAt(0))
    dataView.setUint8(3, 'F'.charCodeAt(0))
    dataView.setUint32(4, 36 + dataLength, true)
    dataView.setUint8(8, 'W'.charCodeAt(0))
    dataView.setUint8(9, 'A'.charCodeAt(0))
    dataView.setUint8(10, 'V'.charCodeAt(0))
    dataView.setUint8(11, 'E'.charCodeAt(0))
    dataView.setUint8(12, 'f'.charCodeAt(0))
    dataView.setUint8(13, 'm'.charCodeAt(0))
    dataView.setUint8(14, 't'.charCodeAt(0))
    dataView.setUint8(15, ' '.charCodeAt(0))
    dataView.setUint32(16, 16, true)
    dataView.setUint16(20, 1, true)
    dataView.setUint16(22, 1, true)
    dataView.setUint32(24, sampleRate, true)
    dataView.setUint32(28, sampleRate * 2, true)
    dataView.setUint16(32, bytesPerSample, true)
    dataView.setUint16(34, bitsPerByte * bytesPerSample, true)
    dataView.setUint8(36, 'd'.charCodeAt(0))
    dataView.setUint8(37, 'a'.charCodeAt(0))
    dataView.setUint8(38, 't'.charCodeAt(0))
    dataView.setUint8(39, 'a'.charCodeAt(0))
    dataView.setUint32(40, dataLength, true)
  
    let index = 44
  
    for (const buffer of buffers) {
      for (const value of buffer) {
        dataView.setInt16(index, value * 0x7fff, true)
        index += 2
      }
    }
  
    return new Blob([dataView], {type: 'audio/wav'})
  }

  
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

        <select class="flex mx-auto text-black-700 text-center font-semibold" name="upload-way" onChange={(e) => setRecord(!record)}>
          <option key={0} value="record">record</option>
          <option key={1} value="file">file</option>
	      </select>


          <div id="record-audio" class="items-center justify-center w-100 h-28">
              <h3 class="text-4xl text-black-700 text-center font-semibold">音声録音</h3>
              <div>
                <button class="m-1" type="button" id="buttonStart">Start</button>
                <button class="m-1" type="button" id="buttonStop" disabled>Stop</button>
              </div>
              <div>
                <audio controls id="audio"></audio>
              </div>
          </div>
           
          <div id="file-audio" class="items-center justify-center w-100 h-28">
            <h3 class="text-4xl text-black-700 text-center font-semibold">url</h3>
            <input class="flex mx-auto text-black-700 text-center font-semibold w-7/12 p-5 my-10" id="failinp" type='file' accept='audio/*' onChange={(e) => setAudio(e.target.files[0])} />
          </div>
            

          
          


          <h3 class="text-4xl text-black-700 text-center font-semibold">comment</h3>
          <textarea class="flex mx-auto text-black-700 text-center font-semibold" placeholder="Comment" onChange={(e) => setExplanation(e.target.value)}>
          {explanation}
          </textarea>


        
        <select class="flex mx-auto text-black-700 text-center font-semibold text-center w-7/12 p-5 my-10" name="post[genre_id]" onChange={(e) => setGenre_id(e.target.value)}>
        {genres.map((genre) => (
          <option key={genres.id} value={genre.id}>{genre.name}</option>
       
     ))}
	      </select>


        <div class= "flex items-center justify-center">

       
        <button onClick={postSound} class='flex text-center p-10 my-5 rounded border-black bg-orange '>Upload</button>

        </div>
      </div>

      <script src="../../../js/encode-audio.js"></script>


      
    </AppLayout>
  );
};

export default CreatePost;
