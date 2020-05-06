import * as React from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity, TextInput } from 'react-native';

export default class SearchList extends React.Component {
    state = {
        refresh: false,
        data: [
            { key: 'Devin' },
            { key: 'Dan' },
            { key: 'Dominic' },
            { key: 'Jackson' },
            { key: 'James' },
            { key: 'Joel' },
            { key: 'John' },
            { key: 'Jillian' },
            { key: 'Jimmy' },
            { key: 'Julie' },
        ]
    }

    componentWillReceiveProps(props) {
        const { refresh, data } = this.props;
        if (props.refresh !== refresh && data != undefined) {
            this.setState({
                data: data.common,
                refresh: !this.state.refresh
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state.refresh}
                    renderItem={({ item }) => <Text style={styles.item}>{JSON.stringify(item)}</Text>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
