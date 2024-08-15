import { useRef } from "react";
import useKey from "../Hooks/useKey";


export default function Search({query,setQuery}){
    const input=useRef(null);
  
    useKey("Enter",function(){
      if(document.activeElement===input.current)return;
      input.current.focus();
      setQuery("");
  
    })
    return(
      <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={input}
  />
    );
  }