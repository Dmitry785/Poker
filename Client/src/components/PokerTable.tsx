import React from "react"
import { Circle, Group, Rect } from "react-konva"
import Player from "./Player.js";

export default class PokerTable extends React.Component{
    constructor(args: any){
        super(args);
    }
    render(){
        return (<Group draggable x={50} y={50}>
                <Rect stroke="black" strokeWidth={5} width={1000} height={500} fill="green" x={50} y={50} cornerRadius={500}>   
                </Rect>
                <Player x={100} y={100}></Player>
                <Player x={550} y={30}></Player>
                <Player x={1000} y={100}></Player>
                <Player x={100} y={500}></Player>
                <Player x={550} y={570}></Player>
                <Player x={1000} y={500}></Player>
            </Group>);
    }
}