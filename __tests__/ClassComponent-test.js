import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'
import ClassComponent from '../SRC/Utils/ClassComponent'

test('testing my first class component', () => {
    const tree = renderer.create(<ClassComponent />).getInstance()
    tree.getData(5)
    expect(tree.state.counter).toEqual(5)
})