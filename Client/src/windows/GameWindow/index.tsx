import { useServerContext } from "../../hooks/useServerContext.js";

export default function GameWindow()  {
    const {selfIdRef} = useServerContext();
    return (<div>
        Game {selfIdRef.current}
    </div>)
}