import React, { createContext, useState } from 'react';
import './App.css';
import { PartyReasons } from './PartyReasons';
import { Login } from './Login';

export interface AppState {
  name: string | undefined;
}

const defaultAppState: AppState = { name: 'test' };

export const AppContext = createContext<AppState>(defaultAppState);

function App() {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const url = new URL(window.location.href);
  
  const name = url.searchParams.get('name');
  if (name !== null && name !== appState.name)
    setAppState({ name: name });
  
  if (appState.name === undefined)
    return (<Login setName={(name: string) => setAppState({ ...appState,  name: name })} />);
  else
    return (
      <AppContext.Provider value={appState}>
        <div className="section">
          <div className="container content">
            <PartyReasons />
          </div>
        </div>
      </AppContext.Provider>
    );
}

export default App;
