import { useState } from "react"

const useInversePaginator = (data: any[], scrollLength: number) => {
  const [idx, setIdx] = useState<number>(0);

  const hasNext = () => {
    return data.length - idx > 0
  }

  const next = () => {
    if (!hasNext()) throw Error("NoNext");
    const firstIdx = data.length - idx - scrollLength > 0 ? data.length - idx - scrollLength : 0;
    const d = data.slice(firstIdx, data.length - idx).reverse();
    setIdx(idx + scrollLength);
    return d;
  }

  return { hasNext, next }
}

export default useInversePaginator;