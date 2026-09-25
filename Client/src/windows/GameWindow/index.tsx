import { Layer, Stage } from "react-konva";
import { useServerContext } from "../../hooks/useServerContext.js";
import PokerTable from "../../components/PokerTable.js";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function GameWindow()  {
    const {selfIdRef} = useServerContext();
    const navigate = useNavigate();
    useEffect(()=>{
        if (!selfIdRef.current)
            navigate("/authentication");
    }, [selfIdRef.current])
    return (<div>
        Game {selfIdRef.current}
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <PokerTable></PokerTable>
            </Layer>
        </Stage>
    </div>)
}