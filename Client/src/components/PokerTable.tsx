import React from "react"
import { Group, Rect, Stage, Layer } from "react-konva"
import Player from "./Player.js";
import styles from "./styles/poker.module.css";

export default class PokerTable extends React.Component<{width: number, height: number}>{
    render(){
        return (
            <div className={styles.container}>
                <Stage width={this.props.width} height={this.props.height}>
                    <Layer>
                        <Group draggable x={50} y={50}>
                            <Rect stroke="black" strokeWidth={5} width={1000} height={500} fill="green" x={50} y={50} cornerRadius={500}>   
                            </Rect>
                            <Player x={100} y={100}></Player>
                            <Player x={550} y={30}></Player>
                            <Player x={1000} y={100}></Player>
                            <Player x={100} y={500}></Player>
                            <Player x={550} y={570}></Player>
                            <Player x={1000} y={500}></Player>
                        </Group>
                    </Layer>
                </Stage>
            </div>);
    }
}