import React from "react";
import { Circle, Layer, Stage } from "react-konva";
export default class App extends React.Component {
    constructor(args) {
        super(args);
        this.state = { isMouseInside: false};
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }
    handleMouseEnter() {
        this.setState({ isMouseInside: true});
    }
    handleMouseLeave() {
        this.setState({ isMouseInside: false});
    }
    render() {
        return (
            <Stage width={window.innerWidth} height={window.innerHeight}><Layer>
            <Circle
                x={100} y={60} radius={50}
                fill="yellow" stroke="black"
                strokeWidth={this.state.isMouseInside ? 5 : 1}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            ></Circle></Layer></Stage>
        );
    }
}