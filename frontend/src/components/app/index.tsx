import * as React from "react";
import { MenuConnect, ModalConnect } from "@components";

export default class App extends React.Component {
  render() {
    return (
      <div className="app">
        <MenuConnect />
        <ModalConnect />
      </div>
    );
  }
}