import React from "react";

const t = {
  YYYY: (d: Date) => {
    return ("0000" + d.getFullYear()).slice(-4);
  },
  MMMM: (d: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[d.getMonth()];
  },
  MMM: (d: Date) => {
    return t.MMMM(d).substring(0, 3);
  },
  MM: (d: Date) => {
    return ("0" + (d.getMonth() + 1)).slice(-2);
  },
  DD: (d: Date) => {
    return ("0" + d.getDate()).slice(-2);
  },
  hh: (d: Date) => {
    return ("0" + (d.getHours() % 12)).slice(-2);
  },
  HH: (d: Date) => {
    return ("0" + d.getHours()).slice(-2);
  },
  mm: (d: Date) => {
    return ("0" + d.getMinutes()).slice(-2);
  }
};

interface TimestampProps extends Partial<JSX.ElementChildrenAttribute> {
  format?: string;
  children: number | Date;
}

export default function Timestamp(props: TimestampProps) {
  const d = new Date(props.children);
  const format = props.format || "MMM-DD-YYYY HH:mm";
  const res = format.replace(/hh|HH|mm|DD|MMMM|MMM|MM|YYYY/g, (a) => t[a] ? t[a](d) : a);
  return (
    <div className="timestamp">{res}</div>
  );
}