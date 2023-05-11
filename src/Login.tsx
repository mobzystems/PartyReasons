import { useState } from "react";

export function Login(props: { setName: (name: string) => void }) {
  const [name, setName] = useState('');

  return (<>
    <form onSubmit={(e) => { e.preventDefault(); props.setName(name); }}>
      <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="button" type="submit" value="OK" />
    </form>
  </>);
}