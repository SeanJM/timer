import * as React from "react";
import { StatelessComponent } from "react";
import { withStore, StoreState } from "@store";
import { dispatch } from "@action";
import { AddCategory } from "./modals";
export * from "@components/modal/modal-window";

export type ModalNames = | "ADD_CATEGORY";

interface Modals {
  [key: string]: typeof React.Component;
}

type ModalProps = StoreState["modal"];

const MODALS: Modals = {
  ADD_CATEGORY: AddCategory
};

function mapStateToProps(state: StoreState) {
  return state.modal;
}

export function Modal(props: ModalProps) {
  const Modal = MODALS[props.name];
  console.log(Modal, props.name);
  return (
    <div className="modal">
      {Modal
        ? <div className="modal_shadowbox" onClick={() => dispatch("MODAL_CLOSE")}></div>
        : null
      }
      {Modal
        ? <Modal {...props.value} />
        : null
      }
    </div>
  );
}

export const ModalConnect = withStore(Modal as StatelessComponent, mapStateToProps)();