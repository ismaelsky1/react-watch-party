import { useCallback, useEffect, useState } from "react"
import { api } from "../../libs/api"
import { useNavigate } from "react-router-dom"
import storage from "../../libs/storage"

export default function Home() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('https://www.youtube.com/watch?v=wmM1Y0FTiz8')
  const navigator = useNavigate();

  const submint = useCallback(async () => {
    const req = {
      name,
      url,
      views: 1,
      currentTimeVideo: 0,
      currentStatusVideo: false,
    };

    const { data } = await api.post('/room', req);

    const getRecent = storage.get('recent') !== null? JSON.parse(storage.get('recent')?? '') : []
    getRecent.push({ id: data._id, name })
    storage.set('recent', JSON.stringify(getRecent))
    storage.set('currentRoom', String(data._id))
    navigator(`/room?k=${data._id}`)
  }, [url,name])

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6 text-emerald-800 font-semibold">
        <span className="font-light text-gray-800  text-1xl">Bem-vindo ao</span><br />
        <span className="font-extrabold text-gray-800 text-3xl">Watch Party</span><br />
        <div className="my-6">
          <span className="font-normal text-gray-800 text-1xl">Nome da Sala:</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="..." autoComplete="none" className='bg-gray-200 rounded-md w-full p-2' />
        </div>
        <div className="my-6">
          <span className="font-normal text-gray-800  text-1xl">Url:</span>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://youtube.com.br/WgwYjkxp" autoComplete="none" className='bg-gray-200 rounded-md w-full p-2' />
        </div>
        <button onClick={submint} className="bg-emerald-400 p-2 rounded-md text-white px-6 hover:bg-emerald-600"> Criar Sala</button>
      </div>
    </div>
  )
}