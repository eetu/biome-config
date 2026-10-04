import { useState } from "react";

export function someHelper() {
  return "helper";
}

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
