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

    viewFood() {
        fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
            method: 'POST', redirect: 'follow',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-app-id': '61aca91d',
                'x-app-key': '47240e9bd8d46633bab0cd154335e8e7',
                'x-remote-user-id': 132,
            },
            body: JSON.stringify({ query: `1 cup chicken noodle soup`, }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // console.table('responseJson.foods[0].full_nutrients', responseJson.foods[0].full_nutrients);
            const food_name = responseJson.foods[0].food_name, full_nutrients = responseJson.foods[0].full_nutrients;
            const nutritionixPayload = responseJson.foods[0];
            console.log('got payload', JSON.stringify(nutritionixPayload));
            
            fetch(`https://us-central1-gini-v0.cloudfunctions.net/analyseNutritionixTest`, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    "Authorization": "Basic c7a5195c11e362086dcd8ce60dcc44ed",
                    'content-type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(nutritionixPayload),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.table(responseJson);
            })
            .catch((error) => { console.error('API error', error); });

        })
        .catch((error) => { console.error(error); });
    }

    render() {
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
                            onPress={() => {this.viewFood()}}
                            title="View"
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
