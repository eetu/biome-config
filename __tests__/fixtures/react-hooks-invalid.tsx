import { useEffect, useState } from "react";

export function Component({ id }: { id: string }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}
