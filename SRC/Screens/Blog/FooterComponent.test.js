import React from 'react'
import 'react-native'
import FooterComponent from './FooterComponent'
import renderer from 'react-test-renderer'



test('render correctly', () => {

    const tree = renderer.create(<FooterComponent commentsForLength={[1, 2, 3]} />).toJSON()

    console.log('tree ', tree)
})