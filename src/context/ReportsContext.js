import { createContext, useContext } from "react";

export const ReportsContext = createContext(null);

export const useReports = () => useContext(ReportsContext);