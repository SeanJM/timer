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
    const hh = d.getHours() % 12;
    return ("0" + (hh === 0 ? 12 : hh)).slice(-2);
  },
  HH: (d: Date) => {
    return ("0" + d.getHours()).slice(-2);
  },

  mm: (d: Date) => {
    return ("0" + d.getMinutes()).slice(-2);
  },

  tt: (d: Date) => {
    return d.getHours() > 11 ? "pm" : "am";
  },
  t: (d: Date) => {
    return t.tt(d)[0];
  },
  T: (d: Date) => {
    return t.t(d).toUpperCase();
  },
  TT: (d: Date) => {
    return t.tt(d).toUpperCase();
  }
};

interface TimestampProps extends Partial<JSX.ElementChildrenAttribute> {
  format?: string;
  children: number | Date;
}

export function Timestamp(props: TimestampProps) {
  const d = new Date(props.children);
  const format = props.format || "MMM-DD-YYYY hh:mmTT";
  const res = format.replace(/hh|HH|mm|DD|MMMM|MMM|MM|YYYY|t|TT|T/g, (a) => t[a] ? t[a](d) : a);
  return (
    <div className="timestamp">{res}</div>
  );
}