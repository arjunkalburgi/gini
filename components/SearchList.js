import * as React from 'react';
import { StyleSheet, FlatList, Text, View, Button } from 'react-native';

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
                data: [...data.common, ...data.branded],
                refresh: !this.state.refresh
            })
        }
    }

    render() {
        // console.table(this.state.data[0]);
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state.refresh}
                    renderItem={({ item }) => <View style={styles.item}>
                        <View style={styles.item_text}>
                            <Text style={styles.item_title}>{item.food_name ? item.food_name : item.key}</Text>
                            <Text style={styles.item_detail}>{item.serving_unit}</Text>
                        </View>
                        <Button
                            title="Add"
                            color="#841584"
                            accessibilityLabel="Learn more about this purple button"
                        ></Button>
                    </View>}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    item_text: { justifyContent: 'center', flex: 6 },
    item_title: {
        fontSize: 18,
    },
    item_detail: {
        fontSize: 14,
    },
});
