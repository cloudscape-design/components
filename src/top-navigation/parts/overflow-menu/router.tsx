// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

type View = 'utilities' | 'dropdown-menu';

interface RouteData {
  headerText?: string;
  headerSecondaryText?: string;
  definition?: any;

  utilityIndex?: number;
}

interface RouteState {
  view: View;
  data: RouteData | null;
}

interface IViewContext {
  state: RouteState;
  setState: Dispatch<SetStateAction<RouteState>>;
}

const defaultCtx: IViewContext = { state: { view: 'utilities', data: null }, setState: () => {} };
export const ViewContext = createContext<IViewContext>(defaultCtx);

export const useNavigate = () => {
  const { setState } = useContext(ViewContext);

  const navigate = (view: View, data: any) => {
    setState({ view, data });
  };

  return navigate;
};

interface RouteProps {
  view: View;
  element?: React.ReactNode | ((data: RouteData | null) => React.ReactElement);
}

export const Route = ({ view, element }: RouteProps) => {
  const { state } = useContext(ViewContext);

  if (view === state.view) {
    if (typeof element === 'function') {
      return element(state.data);
    }

    return <>{element}</>;
  }

  return null;
};

interface RouterProps {
  children?: React.ReactNode;
}

const Router = ({ children }: RouterProps) => {
  const [state, setState] = useState<RouteState>({ view: 'utilities', data: null });
  return <ViewContext.Provider value={{ state, setState }}>{children}</ViewContext.Provider>;
};

export default Router;
