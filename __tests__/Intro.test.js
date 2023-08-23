import React from 'react';
import renderer from 'react-test-renderer';
// import Intro from './Intro';
import Intro from '../SRC/Utils/Intro';
import { FlatList, View, Text } from 'react-native';

test('renders correctly', () => {
    const tree = renderer.create(<Intro />).toJSON();
    console.log("tree", tree)
    expect(tree).toMatchSnapshot();
});

it('testing flatlist', () => {
    const tree = renderer.create(
        <FlatList
            data={['item1', 'item2', 'item3']}
            keyExtractor={item => item}
            renderItem={({ item }) => {
                <View>
                    <Text>{item}</Text>
                </View>
            }}
        />
    ).toJSON()
    expect(tree).toMatchSnapshot()
})