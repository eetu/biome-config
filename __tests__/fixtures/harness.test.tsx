import { useState } from "react";

const Harness = () => {
  const [count, setCount] = useState(0);
  return <Counter count={count} onClick={() => setCount(count + 1)} />;
};

const Counter = ({ count, onClick }: { count: number; onClick: () => void }) => (
  <button onClick={onClick}>{count}</button>
);

export const render = () => <Harness />;
