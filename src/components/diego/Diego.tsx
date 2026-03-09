import diego from "@/assets/diego.png";
import { useState, useImperativeHandle, forwardRef } from "react";
import type { DiegoRef } from "@/types/diego";

export default forwardRef<DiegoRef>(function Diego(_props, ref) {

  const [opacity, setOpacity] = useState(0.0);

  const flash = () => {
    setOpacity(1);

    const timer = setTimeout(() => {
      setOpacity(0);
    }, 10);
  }

  useImperativeHandle(ref, () => ({ flash }), []);

  return (
    <div className="fixed inset-0 z-9999 h-screen w-screen">
      <img
        src={diego}
        alt="Diego"
        className="h-full w-full object-fill"
        style={{ opacity }}
      />
    </div>
  );
});
