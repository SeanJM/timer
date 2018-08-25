import * as React from "react";
import { StatelessComponent } from "react";
import { withStore, StoreState } from "@store";
import { dispatch } from "@action";
export * from "@components/modal/modal-window";

import {
  AddCategoryConnect,
  AddTodoConnect
} from "@components/modal/modals";

export type ModalNames = | "ADD_CATEGORY" | "ADD_TODO";

interface Modals {
  [key: string]: React.ComponentType;
}

type ModalProps = StoreState["modal"];

const MODALS: Modals = {
  ADD_CATEGORY: AddCategoryConnect,
  ADD_TODO: AddTodoConnect,
};

function mapStateToProps(state: StoreState) {
  return state.modal;
}

export function Modal(props: ModalProps) {
  const Modal = MODALS[props.name];

  return (
    <div className="modal">
      {Modal
        ? <div
          className="modal_shadowbox"
          onClick={() => dispatch("MODAL_CLOSE")} />
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