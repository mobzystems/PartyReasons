import React, { createContext, useState } from 'react';
import './App.css';
import { PartyReasons } from './PartyReasons';
import { Login } from './Login';

export interface AppState {
  name: string | undefined;
}

const defaultAppState: AppState = { name: undefined };

export const AppContext = createContext<AppState>(defaultAppState);

function App() {
  const [appState, setAppState] = useState<AppState>(defaultAppState)
  if (appState.name === undefined)
    return (<Login setName={(name: string) => setAppState({ ...appState,  name: name })} />);
  else
    return (
      <AppContext.Provider value={appState}>
        <PartyReasons />
      </AppContext.Provider>
    );
}

export default App;
