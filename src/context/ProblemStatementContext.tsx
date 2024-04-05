import { createContext, useState, useContext } from 'react';

const ProblemStatementContext = createContext(null);

export function ProblemStatementProvider({ children }) {
  const [problemStatement, setProblemStatement] = useState("");

  return (
    <ProblemStatementContext.Provider value={{ problemStatement, setProblemStatement }}>
      {children}
    </ProblemStatementContext.Provider>
  );
}

export function useProblemStatement() {
  return useContext(ProblemStatementContext);
}