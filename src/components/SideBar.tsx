import { PlusCircle, List, MonitorPlay, ClockCounterClockwise } from 'phosphor-react'
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storage from '../libs/storage';

export function Sidebar() {
  const classItemDefault = "disabled:bg-slate-400 disabled:text-emerald-800 mb-2 rounded-full px-4 py-5 sm:p-6 bg-white text-emerald-800 font-semibold hover:text-white hover:bg-emerald-600"
  const classItemActived = "disabled:bg-slate-400 disabled:text-emerald-800 mb-2 rounded-full px-4 py-5 sm:p-6 bg-emerald-400 text-white font-semibold hover:text-white hover:bg-emerald-600"
  const navigate = useNavigate();
  const currentRoom = storage.get('currentRoom');

  const handledNavigation = useCallback((url: string) => {
    const currentRoom = storage.get('currentRoom')
    if (currentRoom && url == '/room') { url = `${url}?k=${currentRoom}` }
    navigate(url)
  }, []);

  return (
    <div className="flex flex-col h-full">
      <button onClick={e => handledNavigation('/home')} className={window.location.pathname.includes('/home') ? classItemActived : classItemDefault}><PlusCircle size={28} /></button>
      <button onClick={e => handledNavigation('/room')} className={window.location.pathname.includes('/room') ? classItemActived : classItemDefault} disabled={currentRoom == null}><MonitorPlay size={28} /></button>
      <button onClick={e => handledNavigation('/list')} className={window.location.pathname.includes('/list') ? classItemActived : classItemDefault}><List size={28} /></button>
      <button onClick={e => handledNavigation('/recent')} className={window.location.pathname.includes('/recent') ? classItemActived : classItemDefault}><ClockCounterClockwise size={28} /></button>
    </div>
  )
}