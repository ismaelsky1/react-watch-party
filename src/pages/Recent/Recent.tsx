import { useCallback, useEffect, useState } from "react";
import { useNavigate, useMatches } from "react-router-dom";
import { api } from "../../libs/api";
import storage from "../../libs/storage";

export default function Recent() {

  const [list, setList] = useState([])
  const navigator = useNavigate();  

  useEffect(() => {
    const getRecent = storage.get('recent') !== null ? JSON.parse(storage.get('recent') ?? '') : []
    setList(getRecent)
  }, [])

  const handledEntre = useCallback(async (id: string) => {
    navigator(`/room?k=${id}`)
  }, [])

  const handledClear = useCallback(async () => {
    storage.remove('recent')
    setList([])
  }, [])

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6 text-emerald-800 font-semibold">
        <span className="font-light text-gray-800  text-1xl">Ultimos acessos</span><br />
        <span className="font-extrabold text-gray-800 text-3xl">Recentes</span><br />
{/* <span className="font-light text-gray-800  text-1xl">Lista</span><br />
        <span className="font-extrabold text-gray-800 text-3xl">Salas abertas</span><br /> */}
        {list.map((item: any) => (
          <div key={item.id} className="my-6 flex items-center justify-between">
            <div>
              <p className="text-gray-800 text-1xl font-bold">{item.name}</p>
              <span className="font-normal text-gray-800 text-1xl">{window.location.host}/room?k={item.id}:</span>
            </div>
            <button onClick={e => handledEntre(item.id)} className="h-10 bg-emerald-400 p-2 rounded-md text-white px-6 hover:bg-emerald-600"> Entrar</button>
          </div>
        ))}
        {list.length > 0 ? (<button onClick={handledClear} className="text-emerald-400 p-2 hover:text-emerald-600"> Limpar</button>): <span className="text-gray-600 py-4 flex font-normal">Nenhuma sala criada recentimente...</span>}
      </div>
    </div>
  )
}