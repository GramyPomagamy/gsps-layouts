import { createGlobalStyle } from 'styled-components';
import { type ReactNode, Fragment } from 'react';

export const GlobalStyle = createGlobalStyle`
   body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: white;
    font-weight: bold;
    font-family: 'Work Sans';
  }
  
  .marquee {
    height: 50px;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
  }
  
  .marquee p {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    line-height: 50px;
    text-align: center;
    -moz-transform: translateX(100%);
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
    -webkit-animation: scroll-left 0s linear infinite;
    animation: scroll-left 18s linear infinite;
  }
  
  @-webkit-keyframes scroll-left {
    0% {
      -webkit-transform: translateX(100%);
    }
    100% {
      -webkit-transform: translateX(-100%);
    }
  }
  
  @keyframes scroll-left {
    0% {
      -moz-transform: translateX(100%);
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
    }
    100% {
      -moz-transform: translateX(-100%);
      -webkit-transform: translateX(-100%);
      transform: translateX(-100%);
    }
  }

  .fade-enter, .fade-appear {
    opacity: 0;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-enter-active, .fade-appear-active {
    opacity: 1;
    transition: opacity 1s;
  }

  .fade-exit-active {
    opacity: 0;
    transition: opacity 1s;
  }
  
  .slide-in-bottom-enter, .slide-in-bottom-appear {
    transform: translateY(-100%);
  }

  .slide-in-bottom-enter-active, .slide-in-bottom-appear-active {
    transform: translateY(0%);
    transition: transform 1s;
  }

  .slide-in-bottom-exit {
    transform: translateY(0%);
  }

  .slide-in-bottom-exit-active {
    transform: translateY(-100%);
    transition: transform 1s;
  }

  .shadow {
    text-shadow: 2px 2px 12px black;
  }
  
  .highlight {
    color: #5f3ac2;
  }
  
  .blink {
    animation: blink-animation 1s steps(5, start) infinite;
    -webkit-animation: blink-animation 1s steps(5, start) infinite;
  }
  
  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }

  .Flex {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    text-align: center;
  }
`;

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <GlobalStyle />
      {children}
    </Fragment>
  );
};

export default ThemeProvider;
