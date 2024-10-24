import axios from "axios"
import { useEffect, useState } from "react"

const url = 'http://localhost:3000/users'

function App() {

  const [users, setUsers] = useState<{email: string, id: number, name: string}[]>([])
  const [userToBeUpdated, setUserToBeUpdated] = useState<{ id: number, name: string, email: string } | null>(null)
  const [step, setStep] = useState<number>(1)

  const [newUser, setNewUser] = useState({name: '', email: ''})

  const getUsersAsync = async () => {
    try {
      const response = await axios.get(url)
    setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePost = async () => {
    try {
      await axios.post(url, newUser)
      setNewUser({name: '', email: ''})
      setStep(1)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${url}/${id}`)
      getUsersAsync()
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleUpdate = async (id: number) => {
    const chosenUser = users.find((user) => user.id === id)
    if (chosenUser) setUserToBeUpdated(chosenUser); setStep(3)
  }

  const submitUpdate = async (id:number) => {
    try {
      await axios.put(`${url}/${id}`, userToBeUpdated)
    getUsersAsync()
    setStep(1)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsersAsync()
  }, [])

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-y-2">
      <button className="border px-2 py-1" onClick={() => { setStep(step === 1 ? 2 : 1) }}>+ Add</button>
      {
        step === 1 && (
          <div className="w-1/2 p-5 border">
      <h1 className="text-[2rem] text-gray-900">Something</h1>
      <div className="flex flex-col gap-y-2">
        {
          users.map((user) => (
            <div key={user.id} className="flex items-center gap-x-5">
              <h1 className="text-[1.2rem] text-gray-800">{user.name}</h1>
              <p className="text-[0.9rem] text-gray-500">{user.email}</p>
              <button onClick={() => { handleUpdate(user.id) }} className="border h-10 rounded-[6px] px-5 bg-indigo-500 text-[#ffffff]">update</button>
              <button onClick={() => { handleDelete(user.id) }} className="border h-10 rounded-[6px] px-5 bg-red-500 text-[#ffffff]">delete</button>
            </div>
          ))
        }
      </div>
      </div>
        )
      }
      {
        step === 2 && (
          <div className="w-1/2 p-5 border">
      <h1 className="text-[2rem]">Something Else</h1>
      <div className="flex flex-col gap-y-2">
       <input value={newUser.name} onChange={({ target }) => { setNewUser(prev => ({ ...prev, name: target.value })) }} placeholder="name" className="border h-10 rounded-[6px] px-5 outline-none" type="text" />
       <input value={newUser.email} onChange={({ target }) => { setNewUser(prev => ({ ...prev, email: target.value })) }} placeholder="email" className="border h-10 rounded-[6px] px-5 outline-none" type="email" />
       <button onClick={handlePost} className="border h-10 rounded-[6px] bg-[#10100e] text-[#ffffff]">send</button>
      </div>
      </div>
        )
      }
      {
        step === 3 && (
          <>
          {
            userToBeUpdated !== null && (
              <div className="w-1/2 p-5 border">
                <h1 className="text-[2rem]">Update user</h1>
                <div className="flex flex-col gap-y-2">
                  <input value={userToBeUpdated.name} onChange={({ target }) => { setUserToBeUpdated({ ...userToBeUpdated, name: target.value }) }} placeholder="name" className="border h-10 rounded-[6px] px-5 outline-none" type="text" />
                  <input value={userToBeUpdated.email} onChange={({ target }) => { setUserToBeUpdated({...userToBeUpdated, email: target.value})}} placeholder="email" className="border h-10 rounded-[6px] px-5 outline-none" type="email" />
                  <button onClick={() => { submitUpdate(userToBeUpdated.id) }} className="border h-10 rounded-[6px] bg-[#10100e] text-[#ffffff]">Update</button>
                </div>
              </div>
            )
          }
          </>
        )
      }
    </div>
  )
}

export default App
