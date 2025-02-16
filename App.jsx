import { useCallback, useEffect, useState ,useRef} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "tailwindcss";
function App() {
const[password, setPassword] = useState("");
const[length, setLength] = useState(0);
const [numberallowed, setNumberallowed] = useState(false);
const[charaterallowed, setCharaterallowed] = useState(false);
 const passref=useRef(null);

 const copypassword=useCallback(()=>
{
  passref.current?.select()
  window.navigator.clipboard.writeText(password)
},[password])

const genratePassword = useCallback(() => {
  let pass = "";
  let str='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if(numberallowed){
    str+='0123456789';
  }
  if(charaterallowed){
    str+='!@#$%^&*()_+';
  }
  let newPassword = ""; // Local variable to store the generated password
  for (let i = 0; i < length; i++) {
    pass = str.charAt(Math.floor(Math.random() * str.length));
    newPassword += pass;
  }

  setPassword(newPassword);
},[length,numberallowed,charaterallowed,setPassword])

useEffect(()=>{
genratePassword();
}, [length,numberallowed,charaterallowed,genratePassword])


  return (
    <div className='w-full max-w-md mx-auto p-4 text-orange-900 bg-gray-700'>
<div className='flex shadow rounded-lg overflow-hidden mb-4'>
  <input
  type='text'
  value={password}
  className='outline-none w-full px-4 py-2'
  placeholder='Enter the length of password'
  ref={passref}
  readOnly
  />
  <button onClick={copypassword} className='bg-blue-500 text-white px-4 py-2' >
    copy</button>
  </div>
  <div className='flex text-sm gap-x-2'>
    <div className='flex items-center gap-x-1'>
<input 
type="range"
min={7}
max={100}
value={length}
onChange={(e)=>{
  setLength(e.target.value)
}}
/>

<label > NUMBER {length}</label>
    </div>
    <div className='flex items-center gap-x-1'>
<input 
type="checkbox"
checked={charaterallowed}
id='chart'
onChange={() => setCharaterallowed(!charaterallowed)}
/>

<label > charater</label>
<input 
type="checkbox"
checked={numberallowed}
id='number'
onChange={() => setNumberallowed(!numberallowed)}
/>

<label > number</label>
    </div>


  </div>


</div>

)}
export default App