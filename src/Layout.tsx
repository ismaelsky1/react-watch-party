import { Sidebar } from './components/SideBar';

export default function Layout({children}: any) {
  return (
    <div className="grid grid-flow-row-dense grid-cols-12 grid-rows-1">
      <div className="col-span-1 flex justify-end pr-2"><Sidebar /></div>
      <div className="col-span-11">{children}</div>
    </div>
  )
}