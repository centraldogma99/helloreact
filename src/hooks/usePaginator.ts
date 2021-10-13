import { useEffect, useState } from "react"

const usePaginator = (data: any[], scrollLength: number) => {
  const [idx, setIdx] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(data.length - idx > 0);

  useEffect(() => {
    setHasNext(data.length - idx > 0);
  }, [data])

  const next = () => {
    if (!hasNext) throw Error("NoNext");
    const lastIdx = idx + scrollLength > data.length ? data.length : idx + scrollLength;
    const d = data.slice(idx, lastIdx)
    setIdx(lastIdx);
    return d;
  }

  return { hasNext, next }
}

export default usePaginator;