import { Text, View } from 'react-native'
import React, { Component } from 'react'

export class ClassComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0
        }
    }

    getData(num) {
        this.setState({ counter: this.state.counter + num })
    }

    render() {
        return (
            <View>
                <Text>{this.state.counter}</Text>
            </View>
        )
    }
}

export default ClassComponent