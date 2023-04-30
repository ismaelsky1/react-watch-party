import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../libs/api";
import storage from "../../libs/storage";

export default function ListRoomPublic() {

  const [list, setList] = useState([])
  const navigator = useNavigate();

  useEffect(() => {
    getList()
  }, [])

  const getList = useCallback(async () => {
    const { data } = await api.get('/room')
    setList(data)
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
        <span className="font-light text-gray-800  text-1xl">Lista</span><br />
        <span className="font-extrabold text-gray-800 text-3xl">Salas abertas</span><br />
        {list.map((item: any) => (
          <div key={item.id} className="my-6 flex items-center justify-between">
            <div>
              <p className="text-gray-800 text-1xl font-bold">{item.name}</p>
              <span className="font-normal text-gray-800 text-1xl">{window.location.host}/room?k={item._id}:</span>
            </div>
            <button onClick={e => handledEntre(item._id)} className="h-10 bg-emerald-400 p-2 rounded-md text-white px-6 hover:bg-emerald-600"> Entrar</button>
          </div>
        ))}
        {list.length === 0 && <span className="text-gray-600 py-4 flex font-normal">Nenhuma sala criada...</span>}
      </div>
    </div>
  )
}