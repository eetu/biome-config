import { useEffect, useState } from "react";

export function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}
