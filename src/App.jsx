import React, { useState } from 'react'

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({children,onClick}) {
  return (
    <button className='button' onClick={onClick}>{children}</button>
  )
}

const App = () => {
  const [friends,setFriends]=useState(initialFriends)

  const [showFriend,setShowFriend]=useState(false)
  const [selectedFriend,setSelectedFriend]=useState(null)

  function handleShowAddFriend() {
    setShowFriend((show)=>!show)
  }

  function handleAddNewFriend(newFriend) {
    setFriends([...friends,newFriend])
    setShowFriend(!showFriend)

  }
  function handleSelection(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend((cur)=> cur?.id===friend.id? null : friend)
    setShowFriend(false)
  }

  function handleSpiltBill(value) {
    console.log(value);
    setFriends((friends)=> friends.map((friend)=>friend.id===selectedFriend.id ? {...friend, balance:friend.balance+value}:friend))
    setSelectedFriend(null)
  }


  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList friends={friends}  onSelection={handleSelection} selectedFriend={selectedFriend}/>
        {showFriend &&  <FormAddFriend  onAddfriends={handleAddNewFriend} /> }

        <Button onClick={handleShowAddFriend}>
          {showFriend? 'Close': 'Add friend'}
          </Button>
        
      </div>
      {selectedFriend &&  <FormSplitBill  selectedFriend={selectedFriend} onSpiltBill={handleSpiltBill} /> }
    </div>
  )
}

export default App



function FriendsList({friends,onSelection,selectedFriend}) {
  return <ul>
    {
      friends.map((friend)=>
       
        <Friend key={friend.id} friend={friend} onSelection={onSelection} selectedFriend={selectedFriend}/>
        )
    }
  </ul>
}

function Friend({friend,onSelection,selectedFriend}) {
  const isSelected=selectedFriend?.id===friend.id
  console.log(selectedFriend);
  console.log(friend);
  console.log(isSelected);

  return <li className={isSelected? 'selected':''}>
    <img src={friend.image} alt={friend.name}/>
     
     {
      friend.balance<0? 
      <p className='red'>You own {friend.name} {Math.abs(friend.balance)}$</p>:
      friend.balance>0? 
      <p className='green'>{friend.name} ownes  you {Math.abs(friend.balance)}$'</p> :
      <p >You and {friend.name} are even</p>

     }
    <Button onClick={()=>onSelection(friend)}>{isSelected? 'close':'select'}</Button>

    </li>
}

function FormAddFriend({onAddfriends}) {
  const[name,setName]=useState()
  const[image,setImage]=useState('https://i.pravatar.cc/48')

  function handleSubmit(e) {
    e.preventDefault()
    console.log(name);
    if (!name || !image) return 
    const newFriend={
      name,
      image,
      balance:0,
      id:crypto.randomUUID()
    }
    console.log(newFriend);

    onAddfriends(newFriend)


  }
  return  (
    <form  className='form-add-friend' onSubmit={handleSubmit}>
      <label htmlFor="">🆗 Friend name</label>
      <input type="text" onChange={e=>setName(e.target.value)} />

      <label htmlFor=""> 🌃 Image Url</label>
      <input type="text"  value={image} onChange={e=>setImage(e.target.value)} />

      <Button>Add</Button>
      
    </form>
  )
}




function FormSplitBill({selectedFriend,onSpiltBill}) {
  console.log(selectedFriend.name);

  const[bill,setBill]=useState()  
    const [paidByUser,setPaidByUser]=useState()
    const paidByFriend=bill-paidByUser
    const [whoIsPaying,setWhoIsPaying]=useState('friend')
  
    function handleSubmit(e) {
      e.preventDefault()

      if (!bill || !paidByUser) return 

      onSpiltBill(whoIsPaying==='user'? paidByFriend : -paidByUser)
    }


  return <form className='form-slit-bill' onSubmit={handleSubmit}>
    <h2>Slit the acount with {selectedFriend.name}</h2>
 <br />
      <label htmlFor="">👱 Bill value</label>
      <input type="number" value={bill} onChange={(e)=>setBill(Number(e.target.value))} />

      <label htmlFor=""> 🆗 You expence</label>
      <input type="number" value={paidByUser} 
      onChange={(e)=>setPaidByUser((Number(e.target.value)>bill ?
        paidByUser :  (Number(e.target.value))
        ))} 
      />

      <label htmlFor="">💸 {selectedFriend.name}'s expence</label>
      <input type="number" disabled={true}  value={paidByFriend}   />

      <label>Who is paying the bill</label>
      <select value={whoIsPaying} onChange={(e)=>setWhoIsPaying(e.target.value)}>
        <option value={'user'}>You</option>
        <option value={'friend'}>{selectedFriend.name}</option>
      </select><br />

      <Button>Spell</Button>
  </form>
}