import React from "react";
import { Empty } from "@components/empty";
import { Icon } from "@components/icon";

export function TagNotFound() {
  return (
    <div className="container">
      <Empty
        icon={<Icon type="close"/>}
        title="Error"
        text="The requested tag does not exist"
      />
    </div>
  );
}