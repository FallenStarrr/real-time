import React, { useRef, useState } from 'react'

const WebSock = () => {
    const [messages, setMessages] = useState([])
    const [value, setValue] = useState('')
    const socket = useRef()
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState('')
  
   

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current.send(JSON.stringify(message))
            console.log('Подключение успешно')
        }
        socket.current.onmessage = (e) => {
            const message = JSON.parse(e.data)
            setMessages(p => [message, ...p])   
        }
        socket.current.onclose = () => {
            console.log('Sock закрыт')
        }
        socket.current.onerror = () => {
            console.log('Произошла ошибка')
        }
    }

 
 

     
   const sendMessage = async () => {
         const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
         }
         socket.current.send(JSON.stringify(message))
         setValue('')
   }

   if (!connected) {
        return  (
            <div className="center">
                <div className="form">
                    <input 
                    value={username}
                     type="text" 
                     placeholder='Введите ваше имя'
                      onChange={e => setUsername(e.target.value)}/>
                    <button onClick={connect}>Войти</button>
                </div>

            </div>
        )
   }
 
   return (
     <div className="center">
         <div>
             <div className="form">
                 <input value={value} type="text" onChange={e => setValue(e.target.value)}/>
                 <button onClick={sendMessage}>Отправить</button>
             </div>
             <div className="messages">
                     {messages.map(mess => 
                         <div 
                        
                         
                         key={mess.id}
                         >
                             {mess.event === 'connection'
                                ? <div className="connecton_message">
                                    Пользователь  {mess.username} подключился
                                </div>
                                : <div className="message">
                                    {mess.username}. {mess.message}
                                    </div>
                             }
                         </div>         
                     )}
             </div>
         </div>
     </div>
   )
}

export default WebSock