import React from "react"
import { Circle, Group, Rect, Text } from "react-konva"

export default class Player extends React.Component<{x: number, y: number}>{
    render(){
        return (
        <Group x={this.props.x} y={this.props.y}>
            <Circle width={100} height={100} fill="red">

            </Circle>
            <Group x={-25} y={55}>
                <Rect fill="black" width={100} height={20} x={-20}></Rect>
                <Text text="Player" fontSize={20} fill="white" ></Text>
            </Group>
            <Group x={-25} y={80}>
                <Rect fill="black" width={100} height={20} x={-20}></Rect>
                <Text align="center" text="Balance" fontSize={20} fill="white" ></Text>
            </Group>
        </Group>)
    }
}