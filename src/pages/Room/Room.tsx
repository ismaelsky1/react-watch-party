import { ChatsTeardrop, Eye, Pause, Play, SkipBack, SkipForward } from "phosphor-react";
import { useCallback, useEffect, useState } from "react";
import io from 'socket.io-client';
import * as uuid from 'uuid';
import { api } from "../../libs/api";
import { useParams, useSearchParams } from "react-router-dom";

const socket = io('http://localhost:3002');

interface Message {
  id: string;
  name: string;
  text: string;
}

interface Payload {
  name: string;
  text: string;
}

interface Video {
  _id?: string;
  name?: string;
  url?: string;
  views?: number;
  currentTimeVideo?: number;
  currentStatusVideo?: boolean;
}

const urlYouTube = 'https://www.youtube.com/embed/'
const params = '&controls=0&disablekb=0&fs=0&loop=0&modestbranding=0&rel=0&modestbranding=0&showinfo=0';

export default function Room() {
  const [name, setName] = useState('');
  const [isName, setIsName] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [video, setVideo] = useState<Video>({});
  const [view, setViews] = useState<number>(0);

  let [searchParams] = useSearchParams();

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [url, setUrl] = useState(urlYouTube);

  const getVideo = useCallback(async (k: string) => {
    const { data } = await api.get(`/room/${k}`)
    const [, idVideo] = data.url.split('=')
    setTime(data.currentTimeVideo)
    setVideo(data);
    setUrl(`${urlYouTube}${idVideo}?autoplay=${data.currentStatusVideo ? 1 : 0}&start=${data.currentTimeVideo}`)
    handledPauser()
  }, [])

  const handledPlay = useCallback(() => {
    socket.emit('videoControl', {
      ...video,
      currentTimeVideo: time + 2,
      currentStatusVideo: true,
    });
  }, [time, video])

  const handledPauser = useCallback(() => {

    socket.emit('videoControl', {
      ...video,
      currentTimeVideo: time,
      currentStatusVideo: false,
    });
  }, [isPaused, time])

  const handledBack = useCallback(() => {
    let newTime = 0
    if (time < 10) newTime = 0;
    else newTime = time - 10

    socket.emit('videoControl', {
      ...video,
      currentTimeVideo: newTime,
      currentStatusVideo: true,
    });

  }, [time, video])

  const handledNext = useCallback(() => {
    socket.emit('videoControl', {
      ...video,
      currentTimeVideo: time + 15,
      currentStatusVideo: true,
    });
  }, [time, video])

  useEffect(() => {
    let interval: any = null;

    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    if (searchParams.get("k") !== null) {
      getVideo(searchParams.get("k") ?? '')
    }

    socket.on('msgToClient', (message: Payload) => {
      const newMessage: Message = {
        id: uuid.v4(),
        name: message.name,
        text: message.text,
      };

      setMessages(e => [...messages, newMessage]);
    });
  }, [messages]);

  useEffect(() => {
    socket.on('videoControl', (control: Video) => {
      if (control.url) {
        const [, idVideo] = control.url.split('=')
        // const u = `${urlYouTube}${idVideo}?autoplay=0&start=${control.currentTimeVideo}${params}`
        const u = `${urlYouTube}${idVideo}?autoplay=${control.currentStatusVideo ? 1 : 0}&start=${control.currentTimeVideo}${params}`
        setUrl(u)
        setTime(control.currentTimeVideo ?? 0)
        setIsActive(!!control.currentStatusVideo);
        setIsPaused(!control.currentStatusVideo);
        setVideo((vi: Video) => {
          return {
            ...vi,
            currentTimeVideo: control.currentTimeVideo,
            currentStatusVideo: control.currentStatusVideo,
          }
        })
        // if (control.currentStatusVideo) {
        //   document.getElementById("ytplayer")?.click();
        // }
      }
    });
  }, []);

  const sendMessage = useCallback(() => {
    if (name.length > 0 && text.length > 0) {
      const message: Payload = {
        name,
        text,
      };
      console.log('sendMessage', message)
      socket.emit('msgToServer', message);
      setText('');
    }
  }, [name, text])

  const handledInitChat = useCallback(() => {
    if (name !== '') {
      const message: Payload = {
        name,
        text: `Entrou no Chat 👋`,
      };
      socket.emit('msgToServer', message);
      setIsName(true)
    }
  }, [name])

  const handledEmoji = useCallback((e: any) => {
    if (name !== '') {
      const message: Payload = {
        name,
        text: e,
      };
      socket.emit('msgToServer', message);
      setIsName(true)
    }
  }, [name])


  return (
    <div className="bg-white overflow-hidden shadow rounded-lg h-full">
      <div className="justify-between flex flex-row">
        <div className="basis-8/12 p-6">
          <div className="justify-between flex py-2 align-bottom">
            <div className="">
              <span className="font-medium text-emerald-900 text-xl">{video?.name}</span><br />
              <span className=" text-emerald-900 text-xs">{location.href}</span>
            </div>
          </div>
          <div className="relative">
            <iframe
              className="rounded-md"
              width="100%"
              height="520"
              src={url}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            // allowFullScreen
            ></iframe>
            {/* <div className="absolute top-0 w-full" style={{ height: 520 }}></div> */}
          </div>
          <div className="space-x-2 py-3 items-center flex text-white">
            <button id='play' className="hover:bg-emerald-600 px-5 py-2 bg-emerald-400 rounded-md" onClick={handledPlay}><Play size={22} /></button>
            <button className="hover:bg-red-600 px-5 py-2 bg-red-500 rounded-md" onClick={handledPauser}><Pause size={22} /></button>
            <button className="disabled:bg-gray-400 hover:bg-emerald-600 px-5 py-2 bg-emerald-400 rounded-md" onClick={handledBack}><SkipBack size={22} /></button>
            {/* <button className="cursor-default outline-none px-5 py-2 bg-emerald-400 rounded-md h-9">
              {time}
               {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:{("0" + Math.floor((time / 1000) % 60)).slice(-2)} 
            </button> */}
            <button className="hover:bg-emerald-600 px-5 py-2 bg-emerald-400 rounded-md" onClick={handledNext}><SkipForward size={22} /></button>
          </div>
        </div>
        <div className="basis-4/12 flex flex-col pr-4">
          
          <div className="flex align-middle text-2xl pt-10 pb-5">
            <ChatsTeardrop className="mr-2" size={32} /> Chat
          </div>
          <div style={{ height: 460 }} className="w-full pr-4 bg-gray-100 rounded-md overflow-y-scroll">
            {messages.map(message => (
              <div key={message.id} className={`my-3 flex flex-col bg-gray-300 rounded-lg p-3 ${message.name == name ? 'ml-16' : 'mr-16 ml-4'}`}>
                <p className={`${message.name == name ? 'text-right' : 'text-left'} font-semibold`}>{message.name}</p>
                <div className={`${message.name == name ? 'text-right' : 'text-left'} `}>
                  {message.text}
                </div>
              </div>))}
          </div>
          <div className="w-full py-2">
            {!isName && (<div className="flex flex-row space-x-1">
              <div className="basis-8/12 h-10">
                <input placeholder="Seu nome" className="outline-none w-full bg-gray-200 rounded-md p-2" value={name} onChange={e => { setName(e.target.value) }} />
              </div>
              <button className="basis-4/12 h-10 w-fit bg-emerald-400 text-white p-2 flex-1 rounded-md" onClick={e => handledInitChat()}>Salvar</button>
            </div>)}

            {isName && (<>
              <div className="space-x-2 w-full">
                <button onClick={e => { handledEmoji('😊') }}>😊</button>

                <button onClick={e => handledEmoji('😍')}>😍</button>
                <button onClick={e => handledEmoji('😎')}>😎</button>
                <button onClick={e => handledEmoji('🙁')}>🙁</button>
                <button onClick={e => handledEmoji('😀')}>😀</button>
                <button onClick={e => handledEmoji('😁')}>😁</button>
                <button onClick={e => handledEmoji('😂')}>😂</button>
                <button onClick={e => handledEmoji('🤣')}>🤣</button>
                <button onClick={e => handledEmoji('😃')}>😃</button>
              </div><br />
              <div className="flex flex-row space-x-1">

                <div className="basis-8/12 h-10">
                  <input placeholder="..." className="outline-none w-full bg-gray-200 rounded-md p-2" value={text} onChange={e => { setText(e.target.value) }} />
                </div>
                <button className="basis-4/12 h-10 w-fit bg-emerald-400 text-white p-2 flex-1 rounded-md" onClick={e => sendMessage()}>Enviar</button>
              </div></>)}
          </div>
        </div>
      </div>
    </div>
  )
}