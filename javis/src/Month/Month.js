import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import Theme from './styles/Theme';
import Main from './Main';



export default function Month(){
  return(
    <div>
      <ThemeProvider theme={Theme}>
        <GlobalStyle />
        <Main />
      </ThemeProvider>,
    </div>

  )
}